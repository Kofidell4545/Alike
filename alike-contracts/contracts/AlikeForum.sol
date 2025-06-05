// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AlikeUser.sol";

/**
 * @title AlikeForum
 * @dev Manages the community forum with privacy-preserving features
 */
contract AlikeForum is ReentrancyGuard, Ownable {
    // State variables
    AlikeUser public userContract;
    
    struct Post {
        uint256 id;
        address author;
        string category;
        bytes32 encryptedTitle;    // Encrypted for privacy
        bytes32 encryptedContent;  // Encrypted for privacy
        string[] tags;
        uint256 timestamp;
        bool isDeleted;
        uint256 likes;
        uint256 commentCount;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        bytes32 encryptedContent;  // Encrypted for privacy
        uint256 timestamp;
        bool isDeleted;
        uint256 likes;
    }

    // Category constants
    string[] public categories = [
        "addiction_recovery",
        "mental_health",
        "nutrition",
        "general_wellness"
    ];

    // Mappings
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public postComments;
    mapping(address => uint256[]) public userPosts;
    mapping(uint256 => mapping(address => bool)) public postLikes;
    mapping(uint256 => mapping(address => bool)) public commentLikes;
    
    uint256 public nextPostId;
    uint256 public nextCommentId;
    
    // Events
    event PostCreated(uint256 indexed postId, address indexed author, string category);
    event PostUpdated(uint256 indexed postId);
    event PostDeleted(uint256 indexed postId);
    event CommentAdded(uint256 indexed postId, uint256 indexed commentId, address indexed author);
    event CommentDeleted(uint256 indexed postId, uint256 indexed commentId);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostUnliked(uint256 indexed postId, address indexed user);
    event CommentLiked(uint256 indexed commentId, address indexed user);
    event CommentUnliked(uint256 indexed commentId, address indexed user);

    // Constructor
    constructor(address _userContract) {
        userContract = AlikeUser(_userContract);
        nextPostId = 1;
        nextCommentId = 1;
    }

    // Modifiers
    modifier onlyRegisteredUser() {
        (bool isRegistered,,,,) = userContract.getUserProfile(msg.sender);
        require(isRegistered, "User not registered");
        _;
    }

    modifier validCategory(string memory category) {
        bool isValid = false;
        for (uint i = 0; i < categories.length; i++) {
            if (keccak256(bytes(category)) == keccak256(bytes(categories[i]))) {
                isValid = true;
                break;
            }
        }
        require(isValid, "Invalid category");
        _;
    }

    /**
     * @dev Create a new forum post
     * @param encryptedTitle Encrypted title of the post
     * @param encryptedContent Encrypted content of the post
     * @param category Category of the post
     * @param tags Array of tags for the post
     */
    function createPost(
        bytes32 encryptedTitle,
        bytes32 encryptedContent,
        string memory category,
        string[] memory tags
    ) external onlyRegisteredUser validCategory(category) {
        require(tags.length <= 5, "Maximum 5 tags allowed");
        
        Post storage newPost = posts[nextPostId];
        newPost.id = nextPostId;
        newPost.author = msg.sender;
        newPost.encryptedTitle = encryptedTitle;
        newPost.encryptedContent = encryptedContent;
        newPost.category = category;
        newPost.tags = tags;
        newPost.timestamp = block.timestamp;
        
        userPosts[msg.sender].push(nextPostId);
        userContract.incrementForumPosts(msg.sender);
        
        emit PostCreated(nextPostId, msg.sender, category);
        nextPostId++;
    }

    /**
     * @dev Add a comment to a post
     * @param postId ID of the post
     * @param encryptedContent Encrypted content of the comment
     */
    function addComment(uint256 postId, bytes32 encryptedContent) external onlyRegisteredUser {
        require(postId < nextPostId, "Invalid post ID");
        require(!posts[postId].isDeleted, "Post is deleted");
        
        Comment memory newComment = Comment({
            id: nextCommentId,
            postId: postId,
            author: msg.sender,
            encryptedContent: encryptedContent,
            timestamp: block.timestamp,
            isDeleted: false,
            likes: 0
        });
        
        postComments[postId].push(newComment);
        posts[postId].commentCount++;
        
        emit CommentAdded(postId, nextCommentId, msg.sender);
        nextCommentId++;
    }

    /**
     * @dev Like or unlike a post
     * @param postId ID of the post
     */
    function togglePostLike(uint256 postId) external onlyRegisteredUser {
        require(postId < nextPostId, "Invalid post ID");
        require(!posts[postId].isDeleted, "Post is deleted");
        
        if (postLikes[postId][msg.sender]) {
            postLikes[postId][msg.sender] = false;
            posts[postId].likes--;
            emit PostUnliked(postId, msg.sender);
        } else {
            postLikes[postId][msg.sender] = true;
            posts[postId].likes++;
            emit PostLiked(postId, msg.sender);
        }
    }

    /**
     * @dev Like or unlike a comment
     * @param postId ID of the post
     * @param commentIndex Index of the comment in the post's comments array
     */
    function toggleCommentLike(uint256 postId, uint256 commentIndex) external onlyRegisteredUser {
        require(postId < nextPostId, "Invalid post ID");
        require(commentIndex < postComments[postId].length, "Invalid comment index");
        require(!postComments[postId][commentIndex].isDeleted, "Comment is deleted");
        
        uint256 commentId = postComments[postId][commentIndex].id;
        
        if (commentLikes[commentId][msg.sender]) {
            commentLikes[commentId][msg.sender] = false;
            postComments[postId][commentIndex].likes--;
            emit CommentUnliked(commentId, msg.sender);
        } else {
            commentLikes[commentId][msg.sender] = true;
            postComments[postId][commentIndex].likes++;
            emit CommentLiked(commentId, msg.sender);
        }
    }

    /**
     * @dev Delete a post (only author or owner)
     * @param postId ID of the post to delete
     */
    function deletePost(uint256 postId) external {
        require(postId < nextPostId, "Invalid post ID");
        require(msg.sender == posts[postId].author || msg.sender == owner(), "Not authorized");
        require(!posts[postId].isDeleted, "Post already deleted");
        
        posts[postId].isDeleted = true;
        emit PostDeleted(postId);
    }

    /**
     * @dev Delete a comment (only author or owner)
     * @param postId ID of the post
     * @param commentIndex Index of the comment
     */
    function deleteComment(uint256 postId, uint256 commentIndex) external {
        require(postId < nextPostId, "Invalid post ID");
        require(commentIndex < postComments[postId].length, "Invalid comment index");
        
        Comment storage comment = postComments[postId][commentIndex];
        require(msg.sender == comment.author || msg.sender == owner(), "Not authorized");
        require(!comment.isDeleted, "Comment already deleted");
        
        comment.isDeleted = true;
        posts[postId].commentCount--;
        emit CommentDeleted(postId, comment.id);
    }

    /**
     * @dev Get all posts by a user
     * @param user Address of the user
     */
    function getUserPosts(address user) external view returns (uint256[] memory) {
        return userPosts[user];
    }

    /**
     * @dev Get comments for a post
     * @param postId ID of the post
     */
    function getPostComments(uint256 postId) external view returns (Comment[] memory) {
        return postComments[postId];
    }

    /**
     * @dev Check if a user has liked a post
     * @param postId ID of the post
     * @param user Address of the user
     */
    function hasLikedPost(uint256 postId, address user) external view returns (bool) {
        return postLikes[postId][user];
    }

    /**
     * @dev Check if a user has liked a comment
     * @param commentId ID of the comment
     * @param user Address of the user
     */
    function hasLikedComment(uint256 commentId, address user) external view returns (bool) {
        return commentLikes[commentId][user];
    }
}
