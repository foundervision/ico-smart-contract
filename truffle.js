const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');

const ProviderEngine = require("web3-provider-engine");
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const FilterSubprovider = require("web3-provider-engine/subproviders/filters.js");
const FetchSubprovider = require("web3-provider-engine/subproviders/fetch.js");

// Get our mnemonic and create an hdwallet
var mnemonic = "nurse spare wagon remain afford ability shed budget fine divide indoor move";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// 0xee99e05cd8bd23e46249dbeb64387484311ef4db
// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var providerUrl = "https://ropsten.infura.io/OEgGdxG5hjBMK5Ev5X1d";
const engine = new ProviderEngine();
engine.addProvider(new FilterSubprovider());
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new FetchSubprovider({ rpcUrl: providerUrl }));
engine.start();

// https://github.com/MetaMask/provider-engine/issues/174
module.exports = {
    package_name: "VisionCoin",
    version: "1.0.0",
    description: "Contract for the VisionCoin ERC20 token",
    authors: [
        "Benjamin Ansbach <benjamin.ansbach@foundervision.com>"
    ],
    keywords: [
        "VisionCoin",
        "FounderVision"
    ],
    networks: {
        local: {
            host: 'localhost',
            port: 8545,
            network_id: 'local'
        },
        docker: {
            host: 'testrpc',
            port: 8545,
            network_id: 'docker',
            gas: 4712388
        },
        ropsten:  {
            provider: engine,
            from: address,
            network_id: 3,
            gas: 4000000
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
