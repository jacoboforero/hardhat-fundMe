const { network } = require("hardhat");
const { networkConfig, developmentChain } = require("../helper-hardhat-config");
module.exports.default = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAdress;
  if (developmentChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAdress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAdress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e;";
  }
  console.log(`ethusdadress is ${ethUsdPriceFeedAdress}`);
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAdress],
    log: true,
  });
  console.log(fundMe.address);
  if (!developmentChain.includes(network.name)) {
    console.log("true");
  }
  console.log("_________");
};
module.exports.tags = ["all", "fundme"];
