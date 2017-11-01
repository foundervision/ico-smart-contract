const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to finish a running or paused Pre-ICO
 */

contract('VC-E Finish running or paused Pre-ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-E-1 should be able to finish the previously paused Pre-ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_PAUSED);
        await contract.finishPreICO();

        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.PRE_ICO_FINISHED, stage.toNumber(),
            'Stage not changed to PRE_ICO_FINISHED.');
    });

    it('VC-E-2 should be able to finish the running Pre-ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        await contract.finishPreICO();

        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.PRE_ICO_FINISHED, stage.toNumber(),
            'Stage not changed to PRE_ICO_FINISHED.');
    });

    it('VC-E-3 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);

        await Helper.assertExpectedError(
            contract.finishPreICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-E-4 should fail if the current stage is not `PRE_ICO_PAUSED` and not `PRE_ICO_RUNNING`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await Helper.assertExpectedError(
            contract.finishPreICO()
        );
    });
});