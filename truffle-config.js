const fs = require('fs');
const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = fs.readFileSync(".secret").toString().trim();
 if (!mnemonic || mnemonic.split(' ').length !== 12) {
  // throw new Error('unable to retrieve mnemonic from .secret');
  console.log('unable to retrieve mnemonic from .secret');
}

//Update gas price Testnet
/* Run this first, to use the result in truffle-config:
  curl https://public-node.testnet.rsk.co/ -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}' \
    > .minimum-gas-price-testnet.json
*/
const gasPriceTestnetRaw = fs.readFileSync(".minimum-gas-price-testnet.json").toString().trim();
const minimumGasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result.minimumGasPrice, 16);
if (typeof minimumGasPriceTestnet !== 'number' || isNaN(minimumGasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-testnet.json');
}
console.log("Minimum gas price Testnet: " + minimumGasPriceTestnet);

//Update gas price Mainnet
/* Run this first, to use the result in truffle-config:
  curl https://public-node.rsk.co/ -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}' \
    > .minimum-gas-price-mainnet.json
*/
const gasPriceMainnetRaw = fs.readFileSync(".minimum-gas-price-mainnet.json").toString().trim();
const minimumGasPriceMainnet = parseInt(JSON.parse(gasPriceMainnetRaw).result.minimumGasPrice, 16);
if (typeof minimumGasPriceMainnet !== 'number' || isNaN(minimumGasPriceMainnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-mainnet.json');
}
console.log("Minimum gas price Mainnet: " + minimumGasPriceMainnet);

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"), 

  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      //gas: 6500000,
    },    
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      //gas: 8000000,
    }, 
    regtest: {
      host: "127.0.0.1",
      port: 4444,
      network_id: "*"
    }, 
    testnet: { //Testnet RSK with dPathEthereum = metamask addresses
      //https://www.npmjs.com/package/@truffle/hdwallet-provider
      //provider: () => new HDWalletProvider(mnemonic, 'https://public-node.testnet.rsk.co', 0, 10),
      provider: () => new HDWalletProvider({
        mnemonic: { phrase: mnemonic },
        providerOrUrl: 'https://public-node.testnet.rsk.co',
        numberOfAddresses: 10,
        pollingInterval: 20e3 
      }),
      network_id: 31,
      gasPrice: Math.floor(minimumGasPriceTestnet * 1.3),
      networkCheckTimeout: 1e6, //1h = 36e5
      //Source: https://dappsdev.org/blog/2021-02-24-how-to-configure-truffle-to-connect-to-rsk/
      // Higher polling interval to check for blocks less frequently
      // during deployment
      deploymentPollingInterval: 20e3,  //15s = 15e3, default is 4e3
      timeoutBlocks: 200,
    },
    testnetRSK: {
      provider: () => new HDWalletProvider(mnemonic, 'https://public-node.testnet.rsk.co', 0, 10, true, "m/44'/37310'/0'/0/"),
      network_id: 31,
      gasPrice: Math.floor(minimumGasPriceTestnet * 1.3),
      networkCheckTimeout: 1e6,
      timeoutBlocks: 100,
      deploymentPollingInterval: 15e3,      
    },    
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, 'https://public-node.rsk.co', 0, 1, true, "m/44'/137'/0'/0/"),
      network_id: 30,
      gasPrice: Math.floor(minimumGasPriceMainnet * 1.02),
      networkCheckTimeout: 1e6
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rpc.goerli.mudit.blog/', 0, 10),      
      network_id: 5,
      networkCheckTimeout: 1e6, //1h = 36e5
    },    
    mumbai: {
      provider: () => new HDWalletProvider(mnemonic, "https://rpc-mumbai.matic.today"),
      network_id: '80001'
    },          
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.1",
      //version: "0.5.4",
      //version: "0.7.5",
    }
  }
};
