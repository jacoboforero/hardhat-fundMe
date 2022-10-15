const { assert, expect } = require("chai");
const {
  deployments,
  ethers,
  getNamedAccounts,
  getSigners,
} = require("hardhat");
!developmentChains.incudes(network.name)
  ? descripe.skip
  : describe("FundMe", function () {
      let fundMe;
      let mockV3Aggregator;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture();
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
          const response = await fundMe.PRICE_FEED();
          assert.equal(response, mockV3Aggregator.address);
        });
      });
      describe("fund", async function () {
        it("fails if you don't send enough eth", async function () {
          await expect(fundMe.fund()).to.be.reverted;
        });
        it("updates the amount funded data structure", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.addressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
        it("adds funders to array of funders", async function () {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.funders(0);
          assert.equal(funder, deployer);
        });
        describe("withdraw", async function () {
          beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
          });
          it("withdraws ETH from a single founder", async function () {
            const startingFundMeBalance = await fundMe.provider.getBalance(
              fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
              deployer
            );
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance = await fundMe.provider.getBalance(
              fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
              deployer
            );

            assert.equal(endingFundMeBalance, 0);
            assert.equal(
              startingFundMeBalance.add(startingDeployerBalance).toString(),
              endingDeployerBalance.add(gasCost.toString())
            );
          });
          it("allows us to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
              const fundMeConnectedContract = await fundMe.connect(accounts[i]);
              fundMeConnectedContract.fund({ value: sendValue });
              const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
              );
              const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
              );

              const transactionResponse = await fundMe.withdraw();
              const transactionReceipt = await transactionResponse.wait(1);
              const { gasUsed, effectiveGasPrice } = transactionReceipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);

              //act

              const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
              );
              const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
              );

              assert.equal(endingFundMeBalance, 0);
              assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                startingFundMeBalance.add(startingDeployerBalance).toString()
              );
              //make sure funders are reset properly

              await expect(fundMe.funders(0)).to.be.reverted;
              for (i = 1; i < 6; i++) {
                assert.equal(
                  await fundMe.addressToAmountFunded(accounts[i].address),
                  0
                );
              }
            }
          });
          it("Only allows the owner to withdraw", async function () {
            //const accounts = ethers.getSigners();
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];

            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.reverted;
          });
        });
      });
    });
