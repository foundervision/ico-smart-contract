const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');
const BonusTable = require('./Framework/BonusTable.js');

/**
 * Tests contract calculation.
 */
contract('VC-L Calculation based on precalculated result-sets.', accounts => {

   // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    const stages = [Helper.STAGES.ICO_RUNNING, Helper.STAGES.PRE_ICO_RUNNING];

    for(let s = 0; s < stages.length; s++) {
        const stage = stages[s];
        const stageName = Helper.getStageName(stage);

        Object.keys(BonusTable).forEach(async function (bonus) {
            const bonusData = BonusTable[bonus];
            for (let transaction = 0; transaction < bonusData.transactions.length; transaction++) {
                const tx = bonusData.transactions[transaction];

                let vc = 0;
                if (stage === Helper.STAGES.ICO_RUNNING) {
                    vc = tx.icoVC;
                } else if (stage === Helper.STAGES.PRE_ICO_RUNNING) {
                    vc = tx.preIcoVC;
                }

                const shouldFail = stage === Helper.STAGES.PRE_ICO_RUNNING && tx.eth.lt(Helper.toWei(20));
                if (shouldFail) {
                    it(`VC-L-0-* (${stageName}) It should fail to send ${Helper.toEther(tx.eth)} ether.`, async () => {
                        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(20);
                        const contract = await builder.build(Helper.STAGES.DEPLOYED);

                        // send < 20ether
                        const wallet = await addressRepository.getWalletWithEnoughWei(tx.eth);
                        await Helper.assertExpectedError(
                            contract.sendTransaction(
                                Helper.toTransaction(wallet, tx.eth)
                            )
                        );
                    });

                } else {
                    it(`VC-L-1-* (${stageName}) It should deduct ${Helper.toEther(vc)} VC from the ICO wallet when ${Helper.toEther(tx.eth)} ether are sent.`, async () => {
                        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(20);
                        const contract = await builder.build(stage);

                        const icoWallet = await addressRepository.getIcoAddress();
                        const otherWallet = await addressRepository.getWalletWithEnoughWei(tx.eth);

                        const balanceBefore = await contract.balanceOf(icoWallet.getAddress());
                        await contract.sendTransaction(
                            Helper.toTransaction(otherWallet, tx.eth)
                        );

                        const balanceAfter = await contract.balanceOf(icoWallet.getAddress());

                        assert.isTrue(
                            balanceBefore.minus(vc).equals(balanceAfter),
                            'The VC was not deducted from the ico wallet.'
                        );
                    });

                    it(`VC-L-2-* (${stageName}) It should credit ${Helper.toEther(vc)} VC to the sender when ${Helper.toEther(tx.eth)} ether are sent.`, async () => {
                        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(20);
                        const contract = await builder.build(stage);

                        const wallet = await addressRepository.getWalletWithEnoughWei(tx.eth);

                        const balanceBefore = await contract.balanceOf(wallet.getAddress());
                        await contract.sendTransaction(
                            Helper.toTransaction(wallet, tx.eth)
                        );

                        const balanceAfter = await contract.balanceOf(wallet.getAddress());

                        assert.isTrue(
                            balanceBefore.plus(vc).equals(balanceAfter),
                            'The VC was not credited to the senders wallet.'
                        );
                    });

                    it(`VC-L-3-* (${stageName}) It should deduct ${Helper.toEther(tx.eth)} Ether from the senders wallet when ${Helper.toEther(vc)} VC are sent.`, async () => {

                        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(20);
                        const contract = await builder.build(stage);
                        const wallet = await addressRepository.getWalletWithEnoughWei(tx.eth);

                        const balanceBefore = await wallet.getEtherBalance();

                        const result = await contract.sendTransaction(
                            Helper.toTransaction(wallet, tx.eth)
                        );

                        const balanceAfter = await wallet.getEtherBalance();

                        assert.isTrue(
                            balanceBefore
                                .minus(tx.eth)
                                .minus(Helper
                                    .gasToWei(result.receipt.gasUsed)
                                ).equals(balanceAfter),
                            'The eth was not deducted from the senders account.'
                        );
                    });

                    it(`VC-L-4-* (${stageName}) It should add ${Helper.toEther(tx.eth)} Ether to the ICO wallet when ${Helper.toEther(vc)} VC are sent.`, async () => {

                        const builder = new ContractBuilder(addressRepository).setMinPreIcoAmount(20);
                        const contract = await builder.build(stage);
                        const wallet = await addressRepository.getWalletWithEnoughWei(tx.eth);
                        const icoWallet = await addressRepository.getIcoAddress();

                        const balanceBefore = await icoWallet.getEtherBalance();

                        const result = await contract.sendTransaction(
                            Helper.toTransaction(wallet, tx.eth)
                        );

                        const balanceAfter = await icoWallet.getEtherBalance();

                        assert.isTrue(
                            balanceBefore
                                .plus(tx.eth)
                                .equals(balanceAfter),
                            'The eth was not added to the ico wallet.'
                        );
                    });
                }
            }
        });

    }

});