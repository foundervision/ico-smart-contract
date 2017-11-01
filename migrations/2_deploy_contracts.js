var VisionCoin = artifacts.require("./VisionCoin.sol");

module.exports = function(deployer, network) {

    console.log(network);
    var config = require('../config/' + network + '.js');
    if (typeof config.startPreIco !== 'number') {
        config.startPreIco = eval(config.startPreIco);
    }
    if (typeof config.endIco !== 'number') {
        config.endIco = eval(config.endIco);
    }

    deployer.deploy(VisionCoin,
        config.icoWallet,
        config.founderVisionWallet,
        config.startPreIco,
        config.endIco,
        config.minPreIcoAmount,
        config.giftable
    );
};