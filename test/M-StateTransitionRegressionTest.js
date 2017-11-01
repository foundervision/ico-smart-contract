const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests all possible and impossible stage transitions
 */
contract('VC-M Tests all possible and impossible stage changes', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    /*
    | NONE | DEPLOYED |
    | DEPLOYED | PRE_ICO_RUNNING |
    | PRE_ICO_RUNNING | PRE_ICO_PAUSED |
    | PRE_ICO_RUNNING | PRE_ICO_FINISHED |
    | PRE_ICO_FINISHED | ICO_RUNNING |
    | ICO_RUNNING | ICO_PAUSED |
    | ICO_RUNNING | ICO_FINISHED |
    | ICO_FINISHED | ACTIVE |*/

    function getTransitionMethod(fromStage, toStage) {
        switch(toStage) {
            case Helper.STAGES.PRE_ICO_RUNNING:
                if(fromStage === Helper.STAGES.PRE_ICO_PAUSED) {
                    return 'resumePreICO';
                } else {
                    return 'startPreICO';
                }
            case Helper.STAGES.ACTIVE:
                return 'setActive';
            case Helper.STAGES.PRE_ICO_PAUSED:
                return 'pausePreICO';
            case Helper.STAGES.PRE_ICO_FINISHED:
                return 'finishPreICO';
            case Helper.STAGES.ICO_RUNNING:
                if(fromStage === Helper.STAGES.ICO_PAUSED) {
                    return 'resumeICO';
                } else {
                    return 'startICO';
                }
            case Helper.STAGES.ICO_PAUSED:
                return 'pauseICO';
            case Helper.STAGES.ICO_FINISHED:
                return 'finishICO';
        }

        // Helper.STAGES.DEPLOYED
        return null;
    }

    function getStageName(stage) {
        switch(stage) {
            case Helper.STAGES.DEPLOYED:
                return 'DEPLOYED';
            case Helper.STAGES.PRE_ICO_RUNNING:
                return 'PRE_ICO_RUNNING';
            case Helper.STAGES.PRE_ICO_PAUSED:
                return 'PRE_ICO_PAUSED';
            case Helper.STAGES.PRE_ICO_FINISHED:
                return 'PRE_ICO_FINISHED';
            case Helper.STAGES.ICO_RUNNING:
                return 'ICO_RUNNING';
            case Helper.STAGES.ICO_PAUSED:
                return 'ICO_PAUSED';
            case Helper.STAGES.ICO_FINISHED:
                return 'ICO_FINISHED';
            case Helper.STAGES.ACTIVE:
                return 'ACTIVE';
        }
    }

    function isValidStageTransition(fromStage, toStage) {
        return (
            (fromStage === Helper.STAGES.DEPLOYED && toStage === Helper.STAGES.PRE_ICO_RUNNING) ||
            (fromStage === Helper.STAGES.PRE_ICO_RUNNING && toStage === Helper.STAGES.PRE_ICO_PAUSED) ||
            (fromStage === Helper.STAGES.PRE_ICO_PAUSED && toStage === Helper.STAGES.PRE_ICO_RUNNING) ||
            (fromStage === Helper.STAGES.PRE_ICO_PAUSED && toStage === Helper.STAGES.PRE_ICO_FINISHED) ||
            (fromStage === Helper.STAGES.PRE_ICO_RUNNING && toStage === Helper.STAGES.PRE_ICO_FINISHED) ||
            (fromStage === Helper.STAGES.PRE_ICO_FINISHED && toStage === Helper.STAGES.ICO_RUNNING) ||
            (fromStage === Helper.STAGES.ICO_RUNNING && toStage === Helper.STAGES.ICO_PAUSED) ||
            (fromStage === Helper.STAGES.ICO_PAUSED && toStage === Helper.STAGES.ICO_FINISHED) ||
            (fromStage === Helper.STAGES.ICO_PAUSED && toStage === Helper.STAGES.ICO_RUNNING) ||
            (fromStage === Helper.STAGES.ICO_RUNNING && toStage === Helper.STAGES.ICO_FINISHED) ||
            (fromStage === Helper.STAGES.ICO_FINISHED && toStage === Helper.STAGES.ACTIVE)
        );
    }

    const allStages = [
        Helper.STAGES.DEPLOYED,
        Helper.STAGES.PRE_ICO_RUNNING,
        Helper.STAGES.PRE_ICO_PAUSED,
        Helper.STAGES.PRE_ICO_FINISHED,
        Helper.STAGES.ICO_RUNNING,
        Helper.STAGES.ICO_PAUSED,
        Helper.STAGES.ICO_FINISHED,
        Helper.STAGES.ACTIVE,
    ];

    let k = 1;
    for(let i = 0; i < allStages.length; i++) {
        for(let j = 0; j < allStages.length; j++) {
            if(isValidStageTransition(allStages[i], allStages[j]) && getTransitionMethod(allStages[i], allStages[j]) !== null) {
                it(`VC-M-${k} should be able to switch from ${getStageName(allStages[i])} to ${getStageName(allStages[j])}.`, async () => {
                    const builder = new ContractBuilder(addressRepository);
                    const contract = await builder.build(allStages[i]);

                    const method = getTransitionMethod(allStages[i], allStages[j]);
                    await contract[method]();

                    const stage = await contract.stage.call();
                    assert.equal(allStages[j], stage.toNumber(),
                        'Stage not changed to ' + getStageName(allStages[j]));
                });
            } else if(!isValidStageTransition(allStages[i], allStages[j]) && getTransitionMethod(allStages[i], allStages[j]) !== null) {
                it(`VC-M-${k} should not be able to switch from ${getStageName(allStages[i])} to ${getStageName(allStages[j])}.`, async () => {
                    const builder = new ContractBuilder(addressRepository);
                    const contract = await builder.build(allStages[i]);

                    const method = getTransitionMethod(allStages[i], allStages[j]);
                    await Helper.assertExpectedError(
                        contract[method]()
                    );
                });
            } else if(getTransitionMethod(allStages[i], allStages[j]) === null) {
                it(`VC-M-${k} should not be able to switch from ${getStageName(allStages[i])} to ${getStageName(allStages[j])} (no method).`, async () => {
                    assert.isTrue(true);
                });
            }
            k++;
        }
    }
});