// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AlikeUser
 * @dev Manages user profiles and professional verification in the Alike platform
 */
contract AlikeUser is Ownable, ReentrancyGuard {
    // Structs
    struct UserProfile {
        bool isRegistered;
        bool isProfessional;
        uint256 registrationDate;
        uint256 sessionsCompleted;
        uint256 forumPosts;
        bytes32 encryptedData; // For additional private user data
    }

    struct Professional {
        bool isVerified;
        string specialization; // One of: ["addiction", "mental_health", "nutrition", "wellness"]
        uint256 verificationDate;
        uint256 totalSessions;
        uint256 rating; // Scaled by 100 (e.g., 450 = 4.5)
    }

    // State variables
    mapping(address => UserProfile) public users;
    mapping(address => Professional) public professionals;
    uint256 public totalUsers;
    uint256 public totalProfessionals;
    address public forumContract;

    // Events
    event UserRegistered(address indexed userAddress, uint256 timestamp);
    event ProfessionalVerified(address indexed professional, string specialization);
    event ProfileUpdated(address indexed userAddress);
    event SessionCompleted(address indexed user, address indexed professional);

    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyProfessional() {
        require(professionals[msg.sender].isVerified, "Not a verified professional");
        _;
    }

    // Constructor
    constructor() {
        totalUsers = 0;
        totalProfessionals = 0;
    }

    /**
     * @dev Register a new user
     * @param encryptedData Optional encrypted user data
     */
    function registerUser(bytes32 encryptedData) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = UserProfile({
            isRegistered: true,
            isProfessional: false,
            registrationDate: block.timestamp,
            sessionsCompleted: 0,
            forumPosts: 0,
            encryptedData: encryptedData
        });

        totalUsers++;
        emit UserRegistered(msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a professional (only owner can call)
     * @param _professional Address of the professional to verify
     * @param _specialty Their area of expertise
     */
    function verifyProfessional(address _professional, string memory _specialty) external onlyOwner {
        require(!professionals[_professional].isVerified, "Already verified");
        require(users[_professional].isRegistered, "User not registered");

        professionals[_professional] = Professional({
            isVerified: true,
            specialization: _specialty,
            verificationDate: block.timestamp,
            totalSessions: 0,
            rating: 0
        });

        users[_professional].isProfessional = true;
        totalProfessionals++;

        emit ProfessionalVerified(_professional, _specialty);
    }

    /**
     * @dev Update user's encrypted data
     * @param encryptedData New encrypted data
     */
    function updateProfile(bytes32 encryptedData) external onlyRegistered {
        users[msg.sender].encryptedData = encryptedData;
        emit ProfileUpdated(msg.sender);
    }

    /**
     * @dev Record a completed session
     * @param user Address of the user who completed the session
     */
    function recordSessionCompleted(address user) external {
        require(msg.sender == forumContract || professionals[msg.sender].isVerified, "Not a verified professional");
        require(users[user].isRegistered, "User not registered");
        
        users[user].sessionsCompleted++;
        professionals[msg.sender].totalSessions++;
        
        emit SessionCompleted(user, msg.sender);
    }

    /**
     * @dev Set the forum contract address
     * @param _forumContract Address of the forum contract
     */
    function setForumContract(address _forumContract) external onlyOwner {
        forumContract = _forumContract;
    }

    /**
     * @dev Increment user's forum post count
     * @param _user Address of the user who made a post
     */
    function incrementForumPosts(address _user) external {
        require(msg.sender == forumContract, "Only forum contract");
        require(users[_user].isRegistered, "User not registered");
        users[_user].forumPosts++;
    }

    // Getter functions
    function getUserProfile(address user) external view returns (
        bool isRegistered,
        bool isProfessional,
        uint256 registrationDate,
        uint256 sessionsCompleted,
        uint256 forumPosts
    ) {
        UserProfile memory profile = users[user];
        return (
            profile.isRegistered,
            profile.isProfessional,
            profile.registrationDate,
            profile.sessionsCompleted,
            profile.forumPosts
        );
    }

    function getProfessionalDetails(address professional) external view returns (
        bool isVerified,
        string memory specialization,
        uint256 verificationDate,
        uint256 totalSessions,
        uint256 rating
    ) {
        Professional memory prof = professionals[professional];
        return (
            prof.isVerified,
            prof.specialization,
            prof.verificationDate,
            prof.totalSessions,
            prof.rating
        );
    }
}
