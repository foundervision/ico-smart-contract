const WalletAddress = require('./WalletAddress.js');

/**
 * A small manager tool to manage wallets in the testing environment.
 */
module.exports = class WalletAddressRepository
{
    /**
     * Creates a new WalletManager instance.
     *
     * @param {String[]} addresses
     */
    constructor(addresses)
    {
        this.contractOwner = new WalletAddress(addresses.shift());
        this.icoWallet = new WalletAddress(addresses.shift());
        this.founderVisionWallet = new WalletAddress(addresses.shift());

        // reindex
        /**
         * @type {WalletAddress[]}
         */
        this.wallets = [];
        addresses.forEach((wallet) => this.wallets.push(new WalletAddress(wallet)));
    }

    /**
     * Gets a wallet that has at least the given amount of ether.
     *
     * @param {BigNumber} wei
     * @return {WalletAddress}
     */
    async getWalletWithEnoughWei(wei)
    {
        for(let idx = 0; idx < this.wallets.length; idx++) {
            const balance = await this.wallets[idx].getEtherBalance();
            if(balance.greaterThan(wei)) {
                return this.wallets[idx];
            }
        }

        throw `Unable to find a wallet with at least ${wei} ether`;
    }

    /**
     * Gets a wallet with less than the given amount of ether.
     *
     * @param {Number} ether
     * @returns {WalletAddress}
     */
    getWalletWithLess(ether)
    {
        const filtered = this.wallets.filter(async (wallet) => {
            const balance = await wallet.getEtherBalance();
            return balance.lessThan(toWei(ether));
        });

        if(filtered.length === 0) {
            throw `Unable to find a wallet with at less than ${ether} ether`;
        }

        return filtered[0];
    }

    /**
     * Gets the wallet of the contract owner.
     *
     * @returns {WalletAddress}
     */
    getContractOwner() {
        return this.contractOwner;
    }

    /**
     * Gets the wallet of the ico address.
     *
     * @returns {WalletAddress}
     */
    getIcoAddress() {
        return this.icoWallet;
    }

    /**
     * Gets the FounderVision wallet address.
     *
     * @returns {WalletAddress}
     */
    getFounderVisionAddress() {
        return this.founderVisionWallet;
    }
};