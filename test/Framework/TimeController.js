/**
 * A class tom manipulate the time in the testrpc server instance to
 * emulate time changes.
 */
module.exports = class TimeController
{
    constructor()
    {

    }

    /**
     * Adds the given amount of seconds to the testrpc time.
     *
     * @param seconds
     * @returns {Promise}
     */
    addSeconds(seconds) {
        return new Promise((resolve, reject) =>
            web3.currentProvider.sendAsync({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [seconds],
                id: new Date().getTime()
            }, (error, result) => error ? reject(error) : resolve(result.result))
        );
    }

    /**
     * Adds the given days to the testrpc time.
     *
     * @param days
     */
    addDays(days) {
        return this.addSeconds(days * 24 * 60 * 60);
    }

    /**
     * Adds the given hours to the testrpc time.
     *
     * @param hours
     */
    addHours(hours) {
        this.addSeconds(hours * 60 * 60);
    }

    /**
     * Adds the given days to the testrpc time.
     *
     * @param days
     */
    addDays(days) {
        this.addSeconds(days * 24 * 60 * 60);
    }

    /**
     * Gets the current timestamp of the testrpc.
     *
     * @returns {*|Number}
     */
    current() {
        return web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    }
}