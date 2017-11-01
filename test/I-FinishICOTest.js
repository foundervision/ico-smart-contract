const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to finish a paused or running ICO
 */
contract('VC-I Finish a running or paused ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-I-1 should be able to finish the previously paused ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_PAUSED);
        await contract.finishICO();

        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.ICO_FINISHED, stage.toNumber(),
            'Stage not changed to ICO_FINISHED.');
    });

    it('VC-I-2 should be able to finish the running ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);
        await contract.finishICO();

        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.ICO_FINISHED, stage.toNumber(),
            'Stage not changed to ICO_FINISHED.');
    });

    it('VC-I-3 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);

        await Helper.assertExpectedError(
            contract.finishICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-I-4 should fail if the current stage is not `ICO_RUNNING` and not `ICO_PAUSED`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await Helper.assertExpectedError(
            contract.finishICO()
        );
    });
});