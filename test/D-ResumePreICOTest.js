const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to resume a paused Pre-ICO
 */
contract('V-D Resume paused Pre-ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-D-1 should be able to resume the previously paused Pre-ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_PAUSED);
        await contract.resumePreICO();
        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.PRE_ICO_RUNNING, stage.toNumber(),
            'Stage not changed to PRE_ICO_RUNNING.');
    });

    it('VC-D-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_PAUSED);

        await Helper.assertExpectedError(
            contract.resumePreICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-D-3 should fail if the current stage is not `PRE_ICO_PAUSED`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();

        await Helper.assertExpectedError(
            contract.resumePreICO()
        );
    });
});