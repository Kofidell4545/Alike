import { expect } from "chai";
import { ethers } from "hardhat";
import { AlikeUser, AlikeForum } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AlikeForum", function () {
  let alikeUser: AlikeUser;
  let alikeForum: AlikeForum;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let encryptedData: string;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy AlikeUser first
    const AlikeUser = await ethers.getContractFactory("AlikeUser");
    alikeUser = await AlikeUser.deploy();
    await alikeUser.waitForDeployment();

    // Deploy AlikeForum
    const AlikeForum = await ethers.getContractFactory("AlikeForum");
    alikeForum = await AlikeForum.deploy(await alikeUser.getAddress());
    await alikeForum.waitForDeployment();

    // Setup test data
    encryptedData = ethers.hexlify(ethers.randomBytes(32));

    // Register users
    await alikeUser.connect(user1).registerUser(encryptedData);
    await alikeUser.connect(user2).registerUser(encryptedData);

    // Set forum contract in AlikeUser
    await alikeUser.setForumContract(await alikeForum.getAddress());
  });

  describe("Post Creation", function () {
    const encryptedTitle = ethers.hexlify(ethers.randomBytes(32));
    const encryptedContent = ethers.hexlify(ethers.randomBytes(32));
    const category = "mental_health";
    const tags = ["anxiety", "support"];

    it("Should allow registered users to create posts", async function () {
      await alikeForum.connect(user1).createPost(
        encryptedTitle,
        encryptedContent,
        category,
        tags
      );

      const post = await alikeForum.posts(1);
      expect(post.author).to.equal(user1.address);
      expect(post.category).to.equal(category);
      expect(post.isDeleted).to.be.false;
    });

    it("Should not allow unregistered users to create posts", async function () {
      const unregistered = (await ethers.getSigners())[5];
      await expect(
        alikeForum.connect(unregistered).createPost(
          encryptedTitle,
          encryptedContent,
          category,
          tags
        )
      ).to.be.revertedWith("User not registered");
    });

    it("Should validate category", async function () {
      await expect(
        alikeForum.connect(user1).createPost(
          encryptedTitle,
          encryptedContent,
          "invalid_category",
          tags
        )
      ).to.be.revertedWith("Invalid category");
    });

    it("Should limit number of tags", async function () {
      const manyTags = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"];
      await expect(
        alikeForum.connect(user1).createPost(
          encryptedTitle,
          encryptedContent,
          category,
          manyTags
        )
      ).to.be.revertedWith("Maximum 5 tags allowed");
    });
  });

  describe("Comments", function () {
    beforeEach(async function () {
      // Create a test post
      await alikeForum.connect(user1).createPost(
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
        "mental_health",
        ["test"]
      );
    });

    it("Should allow users to comment on posts", async function () {
      const commentContent = ethers.hexlify(ethers.randomBytes(32));
      await alikeForum.connect(user2).addComment(1, commentContent);

      const comments = await alikeForum.getPostComments(1);
      expect(comments.length).to.equal(1);
      expect(comments[0].author).to.equal(user2.address);
    });

    it("Should increment comment count on posts", async function () {
      await alikeForum.connect(user2).addComment(1, ethers.hexlify(ethers.randomBytes(32)));
      
      const post = await alikeForum.posts(1);
      expect(post.commentCount).to.equal(1);
    });
  });

  describe("Likes", function () {
    beforeEach(async function () {
      // Create a test post
      await alikeForum.connect(user1).createPost(
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
        "mental_health",
        ["test"]
      );
    });

    it("Should allow users to like posts", async function () {
      await alikeForum.connect(user2).togglePostLike(1);
      
      const post = await alikeForum.posts(1);
      expect(post.likes).to.equal(1);
      expect(await alikeForum.hasLikedPost(1, user2.address)).to.be.true;
    });

    it("Should allow users to unlike posts", async function () {
      await alikeForum.connect(user2).togglePostLike(1);
      await alikeForum.connect(user2).togglePostLike(1);
      
      const post = await alikeForum.posts(1);
      expect(post.likes).to.equal(0);
      expect(await alikeForum.hasLikedPost(1, user2.address)).to.be.false;
    });

    it("Should allow liking comments", async function () {
      await alikeForum.connect(user2).addComment(1, ethers.hexlify(ethers.randomBytes(32)));
      await alikeForum.connect(user1).toggleCommentLike(1, 0);
      
      const comments = await alikeForum.getPostComments(1);
      expect(comments[0].likes).to.equal(1);
    });
  });

  describe("Post Management", function () {
    beforeEach(async function () {
      await alikeForum.connect(user1).createPost(
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
        "mental_health",
        ["test"]
      );
    });

    it("Should allow author to delete post", async function () {
      await alikeForum.connect(user1).deletePost(1);
      
      const post = await alikeForum.posts(1);
      expect(post.isDeleted).to.be.true;
    });

    it("Should allow owner to delete post", async function () {
      await alikeForum.connect(owner).deletePost(1);
      
      const post = await alikeForum.posts(1);
      expect(post.isDeleted).to.be.true;
    });

    it("Should not allow non-author to delete post", async function () {
      await expect(
        alikeForum.connect(user2).deletePost(1)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      // Create multiple posts
      await alikeForum.connect(user1).createPost(
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
        "mental_health",
        ["test1"]
      );
      await alikeForum.connect(user1).createPost(
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
        "addiction_recovery",
        ["test2"]
      );
    });

    it("Should return user's posts", async function () {
      const userPosts = await alikeForum.getUserPosts(user1.address);
      expect(userPosts.length).to.equal(2);
    });

    it("Should return post comments", async function () {
      await alikeForum.connect(user2).addComment(1, ethers.hexlify(ethers.randomBytes(32)));
      await alikeForum.connect(user2).addComment(1, ethers.hexlify(ethers.randomBytes(32)));
      
      const comments = await alikeForum.getPostComments(1);
      expect(comments.length).to.equal(2);
    });
  });
});
