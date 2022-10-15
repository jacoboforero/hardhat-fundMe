const {
  ethers,
  getUnnamedAccounts,
  getNamedAccounts,
  network,
} = require("hardhat");
const { assert } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.incudes(network.name)
  ? descripe.skip
  : describe("FundMe", async function () {
      let fundme;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("allows people to fund and withdraw", async function () {
        await fundme.fund({ value: sendValue });
        await fundme.withdraw;
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), 0);
      });
    });
