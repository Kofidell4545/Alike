import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    "sapphire-testnet": {
      url: process.env.SAPPHIRE_TESTNET_URL || "https://testnet.sapphire.oasis.dev",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 23295,
      gasPrice: "auto",
      gas: 5000000,
      timeout: 60000
    },
    "sapphire-mainnet": {
      url: process.env.SAPPHIRE_MAINNET_URL || "https://sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 23294,
      gasPrice: 100000000
    }
  }
};

export default config;
