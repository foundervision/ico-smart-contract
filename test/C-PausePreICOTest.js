const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to pause a running Pre-ICO
 */
contract('VC-C Pause Pre-ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-C-1 should be able to pause the Pre-ICO.', async () => {
        const builder = new ContractBuilder(addressRepository);
        // behind the curtain it starts the pre-ico and pauses it.
        await builder.build(Helper.STAGES.PRE_ICO_PAUSED);
    });

    it('VC-C-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);

        await Helper.assertExpectedError(
            contract.pausePreICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-C-3 should fail if the current stage is not `PRE_ICO_RUNNING`.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();

        await Helper.assertExpectedError(
            contract.pausePreICO()
        );
    });
});