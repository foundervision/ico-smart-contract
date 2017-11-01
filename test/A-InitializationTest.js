const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests the initialization
 */
contract('VC-A Initialization', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-A-1 should generate 200.000.000 tokens', async () => {
        const contract = await new ContractBuilder(addressRepository).build();
        const expectedSupply = Helper.toWei(200000000);
        const totalSupply = await contract.totalSupply();
        assert.isTrue(totalSupply.equals(expectedSupply),
            'Total supply does not match the expected supply of 200.000.000'
        );
    });

    it('VC-A-2 should set "VC" as the symbol', async () => {
        // create token contract
        const contract = await new ContractBuilder(addressRepository).build();
        const symbol = await contract.symbol.call();
        assert.equal('VC', symbol,
            `Expected symbol to be VC, yet its ${symbol}`);
    });

    it('VC-A-3 should set "VisionCoin" as the name', async () => {
        // create token contract
        const contract = await new ContractBuilder(addressRepository).build();
        const name = await contract.name.call();
        assert.equal('VisionCoin', name,
            `Expected name to be VisionCoin, yet its ${name}`);
    });

    it('VC-A-4 should set "18" as the number of decimals', async () => {
        // create token contract
        const contract = await new ContractBuilder(addressRepository).build();
        const decimals = await contract.decimals.call();
        assert.equal(18, decimals,
            `Expected decimals to be 18, yet its ${decimals}`);
    });

    it('VC-A-5 should fail if the end date of the ICO is lteq the Pre-ICO', async () => {
        // create token contract
        await Helper.assertExpectedError(new ContractBuilder(addressRepository)
            .setPreIcoStart(1)
            .setIcoEnd(1) // same date
            .build()
        );

        // create token contract
        await Helper.assertExpectedError(new ContractBuilder(addressRepository)
            .setPreIcoStart(1)
            .setIcoEnd(.9) // before pre-ico
            .build()
        );
    });

    it('VC-A-6 should fail if the owner address equals the ico address.', async () => {
        // create token contract
        await Helper.assertExpectedError(
            new ContractBuilder(addressRepository)
                .setIcoWallet(addressRepository.getContractOwner())
                .build()
        );
    });

    it('VC-A-7 should fail if the owner address equals the foundervision address.', async () => {
        // create token contract
        await Helper.assertExpectedError(
            new ContractBuilder(addressRepository)
                .setFounderVisionWallet(addressRepository.getContractOwner())
                .build()
        );
    });

    it('VC-A-8 should fail if the foundervision address equals the ico address.', async () => {
        await Helper.assertExpectedError(
            new ContractBuilder(addressRepository)
                .setFounderVisionWallet(addressRepository.getIcoAddress())
                .build()
        );
    });

    it('VC-A-9 should send 100.000.000 VC the ico address.', async () => {
        const contract = await new ContractBuilder(addressRepository).build();
        const expectedBalance = Helper.toWei(100000000);
        const icoBalance = await addressRepository.getIcoAddress().getVCBalance(contract);

        assert.isTrue(expectedBalance.equals(icoBalance),
            'Expected 100.000.000 VC in the ico address.'
        );
    });

    it('VC-A-10 should send 100.000.000 VC the foundervision address.', async () => {
        const contract = await new ContractBuilder(addressRepository).build();
        const expectedBalance = Helper.toWei(100000000);
        const fvBalance = await addressRepository.getFounderVisionAddress().getVCBalance(contract);

        assert.isTrue(expectedBalance.equals(fvBalance),
            'Expected 100.000.000 VC in the foundervision address.'
        );
    });

    it('VC-A-11 should change the contract stage from NONE to DEPLOYED.', async () => {
        const contract = await new ContractBuilder(addressRepository).build();
        const stage = await contract.stage.call();
        assert.equal(Helper.STAGES.DEPLOYED, stage.toNumber(),
            'Stage not changed to DEPLOYED.');
    });

    it('VC-A-12 should set the owner correctly.', async () => {
        const contract = await new ContractBuilder(addressRepository).build();
        const owner = await contract.owner.call();
        assert.equal(addressRepository.getContractOwner().getAddress(), owner,
            'Owner is not the one who created the contract.'
        );
    });

    it('VC-A-13 should set the giftable VC amount correctly.', async () => {
        const contract = await new ContractBuilder(addressRepository)
            .build(Helper.STAGES.DEPLOYED, 250);
        const giftable = await contract.giftable.call();
        assert.equal(250, giftable,
            'Giftable amount is not set correctly..'
        );
    });

    it('VC-A-14 should set the pre-ico cap correctly.', async () => {
        const contract = await new ContractBuilder(addressRepository)
            .build(Helper.STAGES.DEPLOYED, 0);
        const preIcoCap = await contract.preIcoCap.call();
        assert.isTrue(Helper.toWei(50000000).equals(preIcoCap),
            'Pre-ICO Cap not set.'
        );
    });

    it('VC-A-15 should init the ico start date correctly.', async () => {
        const builder = new ContractBuilder(addressRepository)
        const contract = await builder.build(Helper.STAGES.DEPLOYED, 0);
        const preIcoStart = await contract.startPreIco.call();
        assert.equal(builder.getPreIcoStart(), preIcoStart,
            'Pre-ICO Start not set correctyl.'
        );
    });

    it('VC-A-16 should init the ico end date correctly.', async () => {
        const builder = new ContractBuilder(addressRepository)
        const contract = await builder.build(Helper.STAGES.DEPLOYED, 0);
        const endIco = await contract.endIco.call();
        assert.equal(builder.getIcoEnd(), endIco,
            'ICO end not set correctly.'
        );
    });

    it('VC-A-17 should init the ico address correctly.', async () => {
        const builder = new ContractBuilder(addressRepository)
        const contract = await builder.build(Helper.STAGES.DEPLOYED, 0);
        const icoWallet = await contract.icoWallet.call();
        assert.equal(addressRepository.getIcoAddress().getAddress(), icoWallet,
            'ICO address set correctly.'
        );
    });

    it('VC-A-18 should init the foundervision address correctly.', async () => {
        const builder = new ContractBuilder(addressRepository)
        const contract = await builder.build(Helper.STAGES.DEPLOYED, 0);
        const fvWallet = await contract.founderVisionWallet.call();
        assert.equal(addressRepository.getFounderVisionAddress().getAddress(), fvWallet,
            'FV address set correctly.'
        );
    });

    it('VC-A-19 should set the min pre ico enter amount correctly.', async () => {
        const contract = await new ContractBuilder(addressRepository).setMinPreIcoAmount(100)
            .build(Helper.STAGES.DEPLOYED, 250);
        const minPreIcoAmount = await contract.minPreIcoAmount.call();
        assert.equal(100000000000000000000, minPreIcoAmount.toNumber(),
            'Min pre ico amount is not set correctly..'
        );
    });
});