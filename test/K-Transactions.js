const BonusTable = require('./Framework/BonusTable.js');
const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');

/**
 * Tests contract transactions
 */
contract('VC-K Transactions', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-K-1 should deny sending funds if the stage is not `PRE_ICO_RUNNING` or `ICO_RUNNING`.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.DEPLOYED);

        // send < 10ether
        const wallet1 = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));
        await Helper.assertExpectedError(
            contract.sendTransaction(
                Helper.toTransaction(wallet1, Helper.toWei(1))
            )
        );

        // send > 10 ether
        const wallet2 = await addressRepository.getWalletWithEnoughWei(Helper.toWei(11));
        await Helper.assertExpectedError(
            contract.sendTransaction(
                Helper.toTransaction(wallet2, Helper.toWei(11))
            )
        );
    });

    it('VC-K-2 should allow sending funds if the stage is `PRE_ICO_RUNNING` or `ICO_RUNNING`.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);

        // send > 10 ether
        const wallet1 = await addressRepository.getWalletWithEnoughWei(Helper.toWei(11));
        await contract.sendTransaction(
            Helper.toTransaction(wallet1, Helper.toWei(11))
        );

        // switch to ICO
        const builderIco = new ContractBuilder(addressRepository);
        const contractIco = await builderIco.build(Helper.STAGES.ICO_RUNNING);

        // send < 10 ether
        const wallet2 = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));
        await contractIco.sendTransaction(
            Helper.toTransaction(wallet2, Helper.toWei(1))
        );
    });

    it('VC-K-3 should deny sending ether if the stage is `PRE_ICO_RUNNING` and the funds are below "minPreIcoAmount" ether.', async () => {
        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(10);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(9));
        await Helper.assertExpectedError(
            contract.sendTransaction(
                Helper.toTransaction(wallet, Helper.toWei(9))
            )
        );
    });

    it('VC-K-4 should allow funds if the stage is `PRE_ICO_RUNNING` and the funds are gteq "minPreIcoAmount" ether.', async () => {
        // > 10
        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(10);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(11));
        await contract.sendTransaction(
            Helper.toTransaction(wallet, Helper.toWei(11))
        );

        // = 10
        const builder2 = new ContractBuilder(addressRepository);
        const contract2 = await builder2.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet2 = await addressRepository.getWalletWithEnoughWei(Helper.toWei(10));
        await contract2.sendTransaction(
            Helper.toTransaction(wallet2, Helper.toWei(10))
        )
    });

    it('VC-K-5 should deduct the given ether from the sender.', async () => {
        const eth = Helper.toWei(21);
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(eth);

        const balanceBefore = await wallet.getEtherBalance();

        const result = await contract.sendTransaction(
            Helper.toTransaction(wallet, eth)
        );

        const balanceAfter = await wallet.getEtherBalance();

        assert.isTrue(
            balanceBefore
                .minus(eth)
                .minus(Helper
                    .gasToWei(result.receipt.gasUsed)
                ).equals(balanceAfter),
                'The eth was not deducted from the senders account.'
        );
    });

    it('VC-K-6 should send the given ether to the ico wallet.', async () => {
        const eth = Helper.toWei(21);
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(eth);

        const balanceBefore = await addressRepository.getIcoAddress().getEtherBalance();

        await contract.sendTransaction(
            Helper.toTransaction(wallet, eth)
        );

        const balanceAfter = await addressRepository.getIcoAddress().getEtherBalance();

        assert.isTrue(
            balanceBefore
                .plus(eth)
                .equals(balanceAfter),
            'The eth was not credited to ico wallet.'
        );
    });

    it('VC-K-7 should credit VC to the sender.', async () => {
        const eth = Helper.toWei(21);
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(eth);

        const balanceBefore = await wallet.getVCBalance(contract);

        await contract.sendTransaction(
            Helper.toTransaction(wallet, eth)
        );

        const balanceAfter = await wallet.getVCBalance(contract);

        assert.isTrue(
            balanceBefore
                .plus(Helper.toWei(25777.5))
                .equals(balanceAfter),
            'The VC was not sent to the senders account.'
        );
    });

    it('VC-K-8 should deduct VC from the ico wallet.', async () => {
        const eth = Helper.toWei(21);
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(eth);

        const balanceBefore = await addressRepository.getIcoAddress().getVCBalance(contract);

        await contract.sendTransaction(
            Helper.toTransaction(wallet, eth)
        );

        const balanceAfter = await addressRepository.getIcoAddress().getVCBalance(contract);

        assert.isTrue(
            balanceBefore
                .minus(Helper.toWei(25777.5))
                .equals(balanceAfter),
            'The VC was not deducted from the ico address.'
        );
    });

    it('VC-K-9 should deny sending zero transactions.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(0));

        await Helper.assertExpectedError(
            contract.sendTransaction(Helper.toTransaction(wallet, Helper.toWei(0)))
        );
    });

    it('VC-K-10 It should deny sending funds if the status is `PRE_ICO_RUNNING` but the pre-ico cap is reached.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING, 0);

        let balance = await addressRepository.getIcoAddress().getVCBalance(contract);
        let cap = await contract.preIcoCap.call();
        do
        {
            const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(5000));
            await contract.sendTransaction(Helper.toTransaction(wallet, Helper.toWei(5000)));
            balance = await addressRepository.getIcoAddress().getVCBalance(contract);
        }
        while(balance.gt(Helper.toWei(56000000)));

        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(5000));
        await Helper.assertExpectedError(
            contract.sendTransaction(Helper.toTransaction(wallet, Helper.toWei(5000)))
        );
    });

    it('VC-K-11 should deny sending ether if the stage is `ICO_RUNNING` and the funds are below 0.01 ether.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.PRE_ICO_RUNNING);
        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(0.01));
        await Helper.assertExpectedError(
            contract.sendTransaction(
                Helper.toTransaction(wallet, Helper.toWei(0.009))
            )
        );
    });

    it('VC-K-12 should fail if there are no funds left', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 0);

        let i = 0;
        let balance = await addressRepository.getIcoAddress().getVCBalance(contract);
        do
        {
            i++;
            // 5500000
            const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(5000));
            await contract.sendTransaction(Helper.toTransaction(wallet, Helper.toWei(5000)));
            balance = await addressRepository.getIcoAddress().getVCBalance(contract);
        }
        while(i <= 17);

        const wallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(5000));
        await Helper.assertExpectedError(
            contract.sendTransaction(Helper.toTransaction(wallet, Helper.toWei(5000)))
        );
    });
});