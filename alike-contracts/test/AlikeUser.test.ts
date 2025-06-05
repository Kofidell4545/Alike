import { expect } from "chai";
import { ethers } from "hardhat";
import { AlikeUser } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AlikeUser", function () {
  let alikeUser: AlikeUser;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let professional: SignerWithAddress;
  let encryptedData: string;

  beforeEach(async function () {
    [owner, user, professional] = await ethers.getSigners();
    
    const AlikeUser = await ethers.getContractFactory("AlikeUser");
    alikeUser = await AlikeUser.deploy();
    await alikeUser.waitForDeployment();

    // Create some test encrypted data
    encryptedData = ethers.hexlify(ethers.randomBytes(32));
  });

  describe("User Registration", function () {
    it("Should allow a new user to register", async function () {
      await alikeUser.connect(user).registerUser(encryptedData);
      
      const profile = await alikeUser.getUserProfile(user.address);
      expect(profile.isRegistered).to.be.true;
      expect(profile.isProfessional).to.be.false;
      expect(profile.sessionsCompleted).to.equal(0);
      expect(profile.forumPosts).to.equal(0);
    });

    it("Should not allow a user to register twice", async function () {
      await alikeUser.connect(user).registerUser(encryptedData);
      await expect(
        alikeUser.connect(user).registerUser(encryptedData)
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Professional Verification", function () {
    beforeEach(async function () {
      // Register the professional first
      await alikeUser.connect(professional).registerUser(encryptedData);
    });

    it("Should allow owner to verify a professional", async function () {
      await alikeUser.verifyProfessional(professional.address, "mental_health");
      
      const profDetails = await alikeUser.getProfessionalDetails(professional.address);
      expect(profDetails.isVerified).to.be.true;
      expect(profDetails.specialization).to.equal("mental_health");
    });

    it("Should not allow non-owner to verify a professional", async function () {
      await expect(
        alikeUser.connect(user).verifyProfessional(professional.address, "mental_health")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not verify an unregistered user as professional", async function () {
      await expect(
        alikeUser.verifyProfessional(user.address, "mental_health")
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Profile Management", function () {
    beforeEach(async function () {
      await alikeUser.connect(user).registerUser(encryptedData);
    });

    it("Should allow updating profile data", async function () {
      const newEncryptedData = ethers.hexlify(ethers.randomBytes(32));
      await alikeUser.connect(user).updateProfile(newEncryptedData);
      
      // Note: We can't directly check encrypted data as it's private
      // We can only verify that the transaction succeeded
    });

    it("Should not allow unregistered users to update profile", async function () {
      await expect(
        alikeUser.connect(professional).updateProfile(encryptedData)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Session and Post Tracking", function () {
    beforeEach(async function () {
      await alikeUser.connect(user).registerUser(encryptedData);
      await alikeUser.connect(professional).registerUser(encryptedData);
      await alikeUser.verifyProfessional(professional.address, "mental_health");
    });

    it("Should allow professionals to record completed sessions", async function () {
      await alikeUser.connect(professional).recordSessionCompleted(user.address);
      
      const profile = await alikeUser.getUserProfile(user.address);
      expect(profile.sessionsCompleted).to.equal(1);
    });

    it("Should not allow non-professionals to record sessions", async function () {
      await expect(
        alikeUser.connect(user).recordSessionCompleted(professional.address)
      ).to.be.revertedWith("Not a verified professional");
    });

    it("Should allow forum contract to increment forum posts", async function () {
      await alikeUser.connect(owner).setForumContract(owner.address);
      await alikeUser.connect(owner).incrementForumPosts(user.address);
      
      const userProfile = await alikeUser.getUserProfile(user.address);
      expect(userProfile[4]).to.equal(1); // forumPosts
    });

    it("Should not increment posts for unregistered users", async function () {
      const [,,, unregisteredUser] = await ethers.getSigners();
      await alikeUser.connect(owner).setForumContract(owner.address);
      await expect(
        alikeUser.connect(owner).incrementForumPosts(unregisteredUser.address)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Stats Tracking", function () {
    it("Should track total users correctly", async function () {
      expect(await alikeUser.totalUsers()).to.equal(0);
      
      await alikeUser.connect(user).registerUser(encryptedData);
      expect(await alikeUser.totalUsers()).to.equal(1);
      
      await alikeUser.connect(professional).registerUser(encryptedData);
      expect(await alikeUser.totalUsers()).to.equal(2);
    });

    it("Should track total professionals correctly", async function () {
      await alikeUser.connect(professional).registerUser(encryptedData);
      expect(await alikeUser.totalProfessionals()).to.equal(0);
      
      await alikeUser.verifyProfessional(professional.address, "mental_health");
      expect(await alikeUser.totalProfessionals()).to.equal(1);
    });
  });
});
