/**
 * A small wallet object that holds an address and can retrieve the ether
 * and VC balance.
 */
module.exports = class Wallet
{
    /**
     * Creates a new instance of the Wallet class.
     *
     * @param {String} address
     */
    constructor(address)
    {
        this.address = address;
    }

    /**
     * Gets the address of the wallet.
     *
     * @returns {String}
     */
    getAddress() {
        return this.address;
    }

    /**
     * Gets the Vision Coin balance of the current wallet.
     *
     * @param contract
     * @returns {BigNumber}
     */
    async getVCBalance(contract) {
        return await contract.balanceOf(this.address);
    }

    /**
     * Gets the Ether balance of the current wallet.
     *
     * @returns {BigNumber}
     */
    async getEtherBalance() {
        return await web3.eth.getBalance(this.address);
    }
}