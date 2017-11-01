const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to resume a paused ICO
 */
contract('VC-H Resume a paused ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-H-1 should be able to resume the previously paused ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_PAUSED);
        await contract.resumeICO();
        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.ICO_RUNNING, stage.toNumber(),
            'Stage not changed to ICO_RUNNING.');
    });

    it('VC-H-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_PAUSED);

        await Helper.assertExpectedError(
            contract.resumeICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-H-3 should fail if the current stage is not `ICO_PAUSED`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();

        await Helper.assertExpectedError(
            contract.resumeICO()
        );
    });
});