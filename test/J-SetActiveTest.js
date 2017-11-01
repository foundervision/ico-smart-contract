const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to set a finished ICO to ACTIVE.
 */
contract('VC-J Set contract status to active.', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-J-1 should be able to set a finished ICO to ACTIVE.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_FINISHED);
        await contract.setActive();

        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.ACTIVE, stage.toNumber(),
            'Stage not changed to ACTIVE.');
    });

    it('VC-J-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_FINISHED);

        await Helper.assertExpectedError(
            contract.setActive({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-J-3 should fail if the current stage is not `ICO_FINISHED`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await Helper.assertExpectedError(
            contract.setActive()
        );
    });
});