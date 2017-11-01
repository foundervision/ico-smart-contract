const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests to start the ICO
 */
contract('VC-F Start the ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-F-1 should be able to start ICO if all conditions match.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_FINISHED);
        await contract.startICO();
    });

    it('VC-F-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_FINISHED);

        await Helper.assertExpectedError(
            contract.startICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-F-3 should fail if the current stage is not `PRE_ICO_FINISHED`', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await Helper.assertExpectedError(
            contract.startICO()
        );
    });
});