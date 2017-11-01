const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to pause the running ICO
 */
contract('VC-G Pause running ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-G-1 should be able to pause the ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        // behind the curtains it does exactly that
        await builder.build(Helper.STAGES.ICO_PAUSED);
    });

    it('VC-G-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);

        await Helper.assertExpectedError(
            contract.pauseICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-C-3 should fail if the current stage is not `ICO_RUNNING`.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();

        await Helper.assertExpectedError(
            contract.pauseICO()
        );
    });
});