const { network } = require("hardhat");
const {
  developmentChain,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");
module.exports.default = async ({ getNamedAccounts, deployments }) => {
  console.log("Hello");
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChain.includes(network.name)) {
    log("Local Network detected, deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    console.log("Mocks deployed!");
    console.log("__________________");
  }
};
module.exports.tags = ["all", "mocks"];
