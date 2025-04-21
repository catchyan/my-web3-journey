import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("MyToken", function () {
  async function deployMyTokenFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(10000);
    return { myToken, owner, otherAccount };
  }

  it("Should mint success", async function () {
    const { myToken, owner } = await loadFixture(deployMyTokenFixture);
    const initialBalance = await myToken.balanceOf(owner.address);

    // mint 100 tokens
    await myToken.mint(owner.address, 100);

    const finalBalance = await myToken.balanceOf(owner.address);
    expect(finalBalance).to.equal(BigInt(initialBalance) + BigInt(100))
  })


  it("Should return the correct balance", async function () {
    const { myToken, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

    // 余额应该等于初始供应量
    expect(await myToken.balanceOf(owner.address)).to.equal(10000);

    // 转账后，检查余额是否更新
    await myToken.transfer(otherAccount.address, 100);
    expect(await myToken.balanceOf(owner.address)).to.equal(9900);
    expect(await myToken.balanceOf(otherAccount.address)).to.equal(100);
  });

  it("Should transfer tokens between accounts", async function () {
    const { myToken, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

    // 初始时 owner 拥有 10000 个代币
    expect(await myToken.balanceOf(owner.address)).to.equal(10000);

    // owner 向 otherAccount 转账 100 个代币
    await myToken.transfer(otherAccount.address, 100);

    // 检查余额
    expect(await myToken.balanceOf(owner.address)).to.equal(9900);
    expect(await myToken.balanceOf(otherAccount.address)).to.equal(100);
  });


  it("Should approve and transfer tokens from one account to another", async function () {
    const { myToken, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

    // owner 授权 otherAccount 可以花费 500 个代币
    await myToken.approve(otherAccount.address, 500);

    // otherAccount 使用 transferFrom 转账 200 个代币
    await myToken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 200);

    // 检查余额
    expect(await myToken.balanceOf(owner.address)).to.equal(9800);  // owner 的余额减少 200
    expect(await myToken.balanceOf(otherAccount.address)).to.equal(200);  // otherAccount 的余额增加 200
  });

  it("Should return the correct allowance", async function () {
    const { myToken, owner, otherAccount } = await loadFixture(deployMyTokenFixture);
  
    // 授权 otherAccount 使用 500 个代币
    await myToken.approve(otherAccount.address, 500);
  
    // 获取授权额度
    const allowance = await myToken.allowance(owner.address, otherAccount.address);
    expect(allowance).to.equal(500);
  });


  it("Should fail if balance is insufficient", async function () {
    const { myToken, owner, otherAccount } = await loadFixture(deployMyTokenFixture);
  
    // owner 余额为 10000，尝试转账超过余额的金额，应该失败
    await expect(myToken.transfer(otherAccount.address, 20000)).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance").withArgs(owner.address, 10000, 20000);;
  });
  
});
