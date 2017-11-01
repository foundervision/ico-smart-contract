const Helper = require('./Helper.js');

/**
 * Contains a mapping of eth -> bonus percent for the bonus system.
 */
const bonus = function(eth, icoVC, preIcoVC) {
    return {
        eth: Helper.toWei(eth),
        icoVC: Helper.toWei(icoVC),
        preIcoVC: Helper.toWei(preIcoVC)
    };
};

module.exports = {
    1000: {
        percentage: 10,
        transactions: [
            bonus(1000, 1100000, 1300000)
        ]
    },
    750: {
        percentage: 9,
        transactions: [
            bonus(750, 817500, 967500),
            bonus(999.99, 1089989.1, 1289987.1)
        ]
    },
    500: {
        percentage: 8,
        transactions: [
            bonus(500, 540000, 640000),
            bonus(749.99, 809989.2, 959987.2)
        ]
    },
    250: {
        percentage: 7,
        transactions: [
            bonus(250, 267500, 317500),
            bonus(499.99, 534989.3, 634987.3)
        ]
    },
    100: {
        percentage: 6,
        transactions: [
            bonus(100, 106000, 126000),
            bonus(249.99, 264989.4, 314987.4)
        ]
    },
    75: {
        percentage: 5,
        transactions: [
            bonus(75, 78750, 93750),
            bonus(99.99, 104989.5, 124987.5)
        ]
    },
    50: {
        percentage: 4,
        transactions: [
            bonus(50, 52000, 62000),
            bonus(74.99, 77989.6, 92987.6)
        ]
    },
    25: {
        percentage: 3,
        transactions: [
            bonus(25, 25750, 30750),
            bonus(49.99, 51489.7, 61487.7)
        ]
    },
    20: {
        percentage: 2.75,
        transactions: [
            bonus(20, 20550, 24550),
            bonus(24.99, 25677.225, 30675.225)
        ]
    },
    10: {
        percentage: 2.5,
        transactions: [
            bonus(10, 10250, 0),
            bonus(19.99, 20489.75, 0)
        ]
    },
    5: {
        percentage: 2,
        transactions: [
            bonus(5, 5100, 0),
            bonus(5.99, 6109.8, 0)
        ]
    },
    4: {
        percentage: 1.5,
        transactions: [
            bonus(4, 4060, 0),
            bonus(4.99, 5064.85, 0)
        ]
    },
    3: {
        percentage: 1,
        transactions: [
            bonus(3, 3030, 0),
            bonus(3.99, 4029.9, 0)
        ]
    },
    2: {
        percentage: 0.75,
        transactions: [
            bonus(2, 2015, 0),
            bonus(2.99, 3012.425, 0)
        ]
    },
    1: {
        percentage: 0.5,
        transactions: [
            bonus(1, 1005, 0),
            //bonus(1.99, 199.995, 0)
        ]
    },
    0: {
        percentage: 0,
        transactions: [
            bonus(0.99, 990, 0)
        ]
    }
};
