import { expect } from "chai";
import { ethers } from "hardhat";
import { AlikeUser, AlikeSession } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const DAY = 86400; // 24 hours in seconds

describe("AlikeSession", function () {
  let alikeUser: AlikeUser;
  let alikeSession: AlikeSession;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let professional: SignerWithAddress;
  let encryptedData: string;

  beforeEach(async function () {
    [owner, user, professional] = await ethers.getSigners();
    
    // Deploy AlikeUser first
    const AlikeUser = await ethers.getContractFactory("AlikeUser");
    alikeUser = await AlikeUser.deploy();
    await alikeUser.waitForDeployment();

    // Deploy AlikeSession
    const AlikeSession = await ethers.getContractFactory("AlikeSession");
    alikeSession = await AlikeSession.deploy(await alikeUser.getAddress());
    await alikeSession.waitForDeployment();

    // Setup test data
    encryptedData = ethers.hexlify(ethers.randomBytes(32));

    // Register user and professional
    await alikeUser.connect(user).registerUser(encryptedData);
    await alikeUser.connect(professional).registerUser(encryptedData);
    await alikeUser.verifyProfessional(professional.address, "mental_health");

    // Set AlikeSession as authorized to record sessions
    await alikeUser.connect(owner).setForumContract(await alikeSession.getAddress());
  });

  describe("Availability Management", function () {
    it("Should allow professionals to add availability", async function () {
      const now = await time.latest();
      const tomorrow = now + DAY;
      const slots = [tomorrow, tomorrow + 3600, tomorrow + 7200];
      
      await alikeSession.connect(professional).addAvailability(tomorrow, slots);
      
      const availability = await alikeSession.getAvailability(professional.address, tomorrow);
      expect(availability.length).to.equal(3);
      expect(availability[0].startTime).to.equal(slots[0]);
      expect(availability[0].isBooked).to.be.false;
    });

    it("Should not allow non-professionals to add availability", async function () {
      const now = await time.latest();
      const futureTime = now + DAY;
      await expect(
        alikeSession.connect(user).addAvailability(futureTime, [futureTime])
      ).to.be.revertedWith("Not a verified professional");
    });

    it("Should not allow adding past time slots", async function () {
      const yesterday = Math.floor(Date.now() / 1000) - 86400;
      await expect(
        alikeSession.connect(professional).addAvailability(yesterday, [yesterday])
      ).to.be.revertedWith("Cannot add past time slots");
    });
  });

  describe("Session Booking", function () {
    let futureTime: number;
    let sessionCost = ethers.parseEther("0.1");

    beforeEach(async function () {
      const now = await time.latest();
      futureTime = now + DAY;
      await alikeSession.connect(professional).addAvailability(futureTime, [futureTime]);
    });

    it("Should allow users to book available slots", async function () {
      await alikeSession.connect(user).bookSession(
        professional.address,
        futureTime,
        0,
        60,
        0, // ADDICTION type
        { value: sessionCost }
      );

      const availability = await alikeSession.getAvailability(professional.address, futureTime);
      expect(availability[0].isBooked).to.be.true;

      const userSessions = await alikeSession.getUserSessions(user.address);
      expect(userSessions.length).to.equal(1);
    });

    it("Should not allow booking already booked slots", async function () {
      await alikeSession.connect(user).bookSession(
        professional.address,
        futureTime,
        0,
        60,
        0,
        { value: sessionCost }
      );

      await expect(
        alikeSession.connect(user).bookSession(
          professional.address,
          futureTime,
          0,
          60,
          0,
          { value: sessionCost }
        )
      ).to.be.revertedWith("Slot already booked");
    });

    it("Should not allow invalid duration", async function () {
      await expect(
        alikeSession.connect(user).bookSession(
          professional.address,
          futureTime,
          0,
          15, // Less than minimum
          0,
          { value: sessionCost }
        )
      ).to.be.revertedWith("Invalid duration");
    });
  });

  describe("Session Management", function () {
    let sessionId: number;
    let futureTime: number;
    let sessionCost = ethers.parseEther("0.1");

    beforeEach(async function () {
      const now = await time.latest();
      futureTime = now + DAY;
      await alikeSession.connect(professional).addAvailability(futureTime, [futureTime]);
      await alikeSession.connect(user).bookSession(
        professional.address,
        futureTime,
        0,
        60,
        0,
        { value: sessionCost }
      );
      sessionId = 1; // First session ID
    });

    it("Should allow professionals to complete sessions", async function () {
      await time.increaseTo(futureTime + 1);
      const notes = ethers.hexlify(ethers.randomBytes(32));
      
      await alikeSession.connect(professional).completeSession(sessionId, notes);
      
      const session = await alikeSession.sessions(sessionId);
      expect(session.completed).to.be.true;
    });

    it("Should allow cancellation with refund", async function () {
      const userBalanceBefore = await ethers.provider.getBalance(user.address);
      
      await alikeSession.connect(user).cancelSession(sessionId);
      
      const userBalanceAfter = await ethers.provider.getBalance(user.address);
      const session = await alikeSession.sessions(sessionId);
      
      expect(session.cancelled).to.be.true;
      expect(userBalanceAfter).to.be.gt(userBalanceBefore);
    });

    it("Should not allow completing cancelled sessions", async function () {
      await alikeSession.connect(user).cancelSession(sessionId);
      
      await expect(
        alikeSession.connect(professional).completeSession(sessionId, ethers.hexlify(ethers.randomBytes(32)))
      ).to.be.revertedWith("Session cancelled");
    });

    it("Should not allow cancelling completed sessions", async function () {
      await time.increaseTo(futureTime + 1);
      await alikeSession.connect(professional).completeSession(sessionId, ethers.hexlify(ethers.randomBytes(32)));
      
      await expect(
        alikeSession.connect(user).cancelSession(sessionId)
      ).to.be.revertedWith("Session already completed");
    });
  });

  describe("Session Queries", function () {
    it("Should return correct sessions for users", async function () {
      const now = await time.latest();
      const futureTime = now + DAY;
      await alikeSession.connect(professional).addAvailability(futureTime, [futureTime, futureTime + 3600]);
      
      await alikeSession.connect(user).bookSession(
        professional.address,
        futureTime,
        0,
        60,
        0,
        { value: ethers.parseEther("0.1") }
      );
      
      const userSessions = await alikeSession.getUserSessions(user.address);
      expect(userSessions.length).to.equal(1);
    });

    it("Should return correct sessions for professionals", async function () {
      const now = await time.latest();
      const futureTime = now + DAY;
      await alikeSession.connect(professional).addAvailability(futureTime, [futureTime]);
      
      await alikeSession.connect(user).bookSession(
        professional.address,
        futureTime,
        0,
        60,
        0,
        { value: ethers.parseEther("0.1") }
      );
      
      const profSessions = await alikeSession.getProfessionalSessions(professional.address);
      expect(profSessions.length).to.equal(1);
    });
  });
});
