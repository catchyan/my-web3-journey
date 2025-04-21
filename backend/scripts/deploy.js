async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const deployment = await MyToken.deploy(10000000);
  
  // 等待部署完成
  const myToken = await deployment.waitForDeployment();
  
  console.log("Contract deployed to:", await myToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
