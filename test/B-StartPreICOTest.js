const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests the start of the pre-ICO
 */
contract('VC-B Start Pre-ICO', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-B-1 should be able to start the Pre-ICO if all conditions match.', async () => {
        const builder = new ContractBuilder(addressRepository);
        await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
    });

    it('VC-B-2 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await Helper.assertExpectedError(
            contract.startPreICO({
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-B-3 it should fail if the current stage is not `DEPLOYED`.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);
        await Helper.assertExpectedError(
            contract.startPreICO()
        );
    });

    it('VC-B-4 should fail if the current date is earlier than the initial Pre-ICO start date.', async () => {
        const contract = await new ContractBuilder(addressRepository)
            .setPreIcoStart(1)
            .setIcoEnd(3)
            .build();
        // now == preIco-1 day
        await Helper.assertExpectedError(
            contract.startPreICO()
        );
    });

    it('VC-B-5 should fail if the current date is greater than or equals the end date.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        await builder.addDaysToNow(1);
        await Helper.assertExpectedError(
            contract.startPreICO()
        );
    });
});