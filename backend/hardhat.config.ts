import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// 加载 .env 文件
dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,  // 使用 Infura 提供的 Sepolia URL
      accounts: [`0x${process.env.PRIVATE_KEY}`],  // 使用你的钱包私钥
    }
  }
};

export default config;
