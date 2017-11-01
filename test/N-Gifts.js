const ContractBuilder = require('./Framework/ContractBuilder.js');
const WalletAddressRepository = require('./Framework/WalletAddressRepository.js');
const Helper = require('./Framework/Helper.js');
const BonusTable = require('./Framework/BonusTable.js');

/**
 * Tests sending gifts.
 */
contract('VC-N Gifts', accounts => {

    // initialize accounts
    const addressRepository = new WalletAddressRepository(accounts);

    it('VC-N-1 It should give 10VC as gift.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 100);

        const destinationWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));
        const balanceBefore = await destinationWallet.getVCBalance(contract);
        await contract.makeGift(destinationWallet.getAddress(), {
            from: addressRepository.getContractOwner().getAddress()
        });
        const balanceAfter = await destinationWallet.getVCBalance(contract);

        assert.isTrue(
            balanceBefore
                .plus(Helper.toWei(10))
                .equals(balanceAfter),
            'The sender was not gifted.'
        );
    });

    it('VC-N-2 It should not give 10VC as a gift if there is no gift left.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 9);

        const destinationWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));
        await Helper.assertExpectedError(
            contract.makeGift(destinationWallet.getAddress(), {
                from: addressRepository.getContractOwner().getAddress()
            })
        );

    });

    it('VC-N-3 It should not give 10VC as a gift if the address is already gifted.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 100);

        const destinationWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));
        await contract.makeGift(destinationWallet.getAddress(), {
            from: addressRepository.getContractOwner().getAddress()
        });
        await Helper.assertExpectedError(contract.makeGift(destinationWallet.getAddress(), {
                from: addressRepository.getContractOwner().getAddress()
            })
        );

    });

    it('VC-N-4 should deduct the gifted VC from the ico wallet.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 100);
        const destWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));

        const balanceBefore = await addressRepository.getIcoAddress().getVCBalance(contract);
        await contract.makeGift(destWallet.getAddress(), {
            from: addressRepository.getContractOwner().getAddress()
        });
        const balanceAfter = await addressRepository.getIcoAddress().getVCBalance(contract);

        assert.isTrue(
            balanceBefore.minus(Helper.toWei(10)).equals(balanceAfter),
            'The gift amount was not removed from vc wallet.'
        );
    });

    it('VC-N-5 should subtract 10 VC from the giftable amount.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 100);
        const destWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));

        const giftableBefore = await contract.giftable.call();
        await contract.makeGift(destWallet.getAddress(), {
            from: addressRepository.getContractOwner().getAddress()
        });
        const giftableAfter = await contract.giftable.call();

        assert.isTrue(
            giftableBefore.minus(10).equals(giftableAfter),
            'The gift amount was not removed from the giftable variable.'
        );
    });


    it('VC-N-6 should credit 10VC to the sender address.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING, 100);
        const destWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));

        const balanceBefore = await destWallet.getVCBalance(contract);
        await contract.makeGift(destWallet.getAddress(), {
            from: addressRepository.getContractOwner().getAddress()
        });
        const balanceAfter = await destWallet.getVCBalance(contract);

        assert.isTrue(
            balanceBefore.plus(Helper.toWei(10)).equals(balanceAfter),
            'The gift amount was not credited to the wallet.'
        );
    });

    it('VC-N-7 should fail if the caller is not the contract owner.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build(Helper.STAGES.ICO_RUNNING);
        const destWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));

        await Helper.assertExpectedError(
            contract.makeGift(destWallet.getAddress(), {
                from: addressRepository.getFounderVisionAddress().getAddress()
            })
        );
    });

    it('VC-N-8 should fail if status is not ICO_RUNNING or PRE_ICO_RUNNING.', async () => {
        const builder = new ContractBuilder(addressRepository);
        const contract = await builder.build();
        const destWallet = await addressRepository.getWalletWithEnoughWei(Helper.toWei(1));

        await Helper.assertExpectedError(
            contract.makeGift(destWallet.getAddress(), {
                from: addressRepository.getContractOwner().getAddress()
            })
        );
    });

});