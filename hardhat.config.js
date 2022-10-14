require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/pN2UxY1drkHtFssAoWZx6RMkfjynMbyk",
      accounts: [
        "a7855f9a202c5bb8c56a1b8b17cb857cb8ab29afec2139b0a308115759d998ef",
      ],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },

  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
