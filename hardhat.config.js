require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20,
        initialIndex: 0,
        path: "m/44'/60'/0'/0",
      },
      mining: {
        auto: true,
        interval: 5000, 
      },
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
      websocket: true
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
