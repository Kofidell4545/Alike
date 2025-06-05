import { ethers } from "hardhat";

async function main() {
  // Deploy AlikeUser first
  console.log("Deploying AlikeUser contract...");
  const AlikeUser = await ethers.getContractFactory("AlikeUser");
  const alikeUser = await AlikeUser.deploy();
  await alikeUser.waitForDeployment();
  const alikeUserAddress = await alikeUser.getAddress();
  console.log(`AlikeUser deployed to ${alikeUserAddress}`);

  // Deploy AlikeSession with AlikeUser address
  console.log("\nDeploying AlikeSession contract...");
  const AlikeSession = await ethers.getContractFactory("AlikeSession");
  const alikeSession = await AlikeSession.deploy(alikeUserAddress);
  await alikeSession.waitForDeployment();
  const alikeSessionAddress = await alikeSession.getAddress();
  console.log(`AlikeSession deployed to ${alikeSessionAddress}`);

  // Deploy AlikeForum with AlikeUser address
  console.log("\nDeploying AlikeForum contract...");
  const AlikeForum = await ethers.getContractFactory("AlikeForum");
  const alikeForum = await AlikeForum.deploy(alikeUserAddress);
  await alikeForum.waitForDeployment();
  const alikeForumAddress = await alikeForum.getAddress();
  console.log(`AlikeForum deployed to ${alikeForumAddress}`);

  // Set up contract relationships
  console.log("\nSetting up contract relationships...");
  
  // Set AlikeForum address in AlikeUser
  const setForumTx = await alikeUser.setForumContract(alikeForumAddress);
  await setForumTx.wait();
  console.log(`Set forum contract in AlikeUser to ${alikeForumAddress}`);

  // Print all addresses for verification
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`AlikeUser: ${alikeUserAddress}`);
  console.log(`AlikeSession: ${alikeSessionAddress}`);
  console.log(`AlikeForum: ${alikeForumAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
