import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  
  console.log("Wallet address:", address);
  console.log("Balance:", ethers.formatEther(balance), "ROSE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
