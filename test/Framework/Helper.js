// fetch token contract
const BigNumber = require('bignumber.js');

/**
 * Simple wrapper function that returns a transaction object with the
 * given address and value.
 *
 * @param {Wallet} wallet
 * @param {BigNumber} wei
 */
module.exports.toTransaction = (wallet, wei) => ({
    from: wallet.getAddress(),
    value: wei.toNumber()
});

/**
 * Calculates the wei from the given eth amounts.
 *
 * @param eth
 * @return {BigNumber}
 */
module.exports.toWei = function(eth)
{
    const num = new BigNumber(eth);
    return num.times(Math.pow(10, 18));
};

module.exports.gasToWei = function(gas)
{
    const num = new BigNumber(gas);
    return num.times(Math.pow(10, 11));
};

/**
 * Calculates the ether from the given wei amounts.
 *
 * @param wei
 * @return {BigNumber}
 */
module.exports.toEther = function(wei)
{
    const num = new BigNumber(wei);
    return num.div(Math.pow(10, 18));
};

/**
 * Gets a method with a message that, if called, will trigger a
 * failed assertion.
 *
 * @param msg
 */
const fail = (msg) => (error) => assert(
    false, error ? `${msg}, but got error: ${error.message}` : msg
);
module.exports.fail = fail;

/**
 * Assertion that an error is expected and should be
 *
 * @param promise
 * @returns {Promise.<void>}
 */
module.exports.assertExpectedError = async (promise) => {
    try {
        await promise;
        fail('expected to fail')();
    } catch (error) {
        assert(error.message.indexOf('invalid opcode') >= 0,
            `Expected throw, but got: ${error.message}`
        );
    }
};


const timeout = ms => new Promise(res => setTimeout(res, ms));

module.exports.delay = async function (ms) {
    await timeout(ms)
};

const STAGES = {
    NONE: 0,
    DEPLOYED: 1,
    PRE_ICO_RUNNING: 2,
    PRE_ICO_PAUSED: 3,
    PRE_ICO_FINISHED: 4,
    ICO_RUNNING: 5,
    ICO_PAUSED: 6,
    ICO_FINISHED: 7,
    ACTIVE: 8
};
module.exports.STAGES = STAGES;

module.exports.getStageName = function(stage) {
    switch(stage) {
        case STAGES.DEPLOYED:
            return 'DEPLOYED';
        case STAGES.PRE_ICO_RUNNING:
            return 'PRE_ICO_RUNNING';
        case STAGES.PRE_ICO_PAUSED:
            return 'PRE_ICO_PAUSED';
        case STAGES.PRE_ICO_FINISHED:
            return 'PRE_ICO_FINISHED';
        case STAGES.ICO_RUNNING:
            return 'ICO_RUNNING';
        case STAGES.ICO_PAUSED:
            return 'ICO_PAUSED';
        case STAGES.ICO_FINISHED:
            return 'ICO_FINISHED';
        case STAGES.ACTIVE:
            return 'ACTIVE';
    }
}