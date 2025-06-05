// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AlikeUser.sol";

/**
 * @title AlikeSession
 * @dev Manages therapy sessions between users and professionals
 */
contract AlikeSession is ReentrancyGuard, Ownable {
    // State variables
    AlikeUser public userContract;
    
    struct Session {
        address user;
        address professional;
        uint256 scheduledTime;
        uint256 duration; // in minutes
        bytes32 encryptedNotes; // Professional's encrypted session notes
        bool completed;
        bool cancelled;
        SessionType sessionType;
        uint256 amount; // Payment amount in wei
    }

    enum SessionType {
        ADDICTION,
        MENTAL_HEALTH,
        NUTRITION,
        WELLNESS
    }

    struct TimeSlot {
        uint256 startTime;
        bool isBooked;
    }

    // Mappings
    mapping(uint256 => Session) public sessions;
    mapping(address => mapping(uint256 => TimeSlot[])) public professionalAvailability;
    mapping(address => uint256[]) public userSessions;
    mapping(address => uint256[]) public professionalSessions;
    
    uint256 public nextSessionId;
    uint256 public minSessionDuration = 30; // minimum 30 minutes
    uint256 public maxSessionDuration = 120; // maximum 2 hours
    
    // Events
    event SessionScheduled(uint256 indexed sessionId, address indexed user, address indexed professional);
    event SessionCompleted(uint256 indexed sessionId);
    event SessionCancelled(uint256 indexed sessionId);
    event AvailabilityUpdated(address indexed professional, uint256 date);
    event NotesUpdated(uint256 indexed sessionId);

    // Constructor
    constructor(address _userContract) {
        userContract = AlikeUser(_userContract);
        nextSessionId = 1;
    }

    // Modifiers
    modifier onlyRegisteredUser() {
        (bool isRegistered,,,,) = userContract.getUserProfile(msg.sender);
        require(isRegistered, "User not registered");
        _;
    }

    modifier onlyProfessional() {
        (bool isVerified,,,,) = userContract.getProfessionalDetails(msg.sender);
        require(isVerified, "Not a verified professional");
        _;
    }

    modifier validSession(uint256 sessionId) {
        require(sessionId < nextSessionId, "Invalid session ID");
        require(!sessions[sessionId].cancelled, "Session cancelled");
        _;
    }

    /**
     * @dev Professional adds available time slots
     * @param date Date in UNIX timestamp (midnight of the day)
     * @param timeSlots Array of start times (in UNIX timestamp)
     */
    function addAvailability(uint256 date, uint256[] calldata timeSlots) external onlyProfessional {
        delete professionalAvailability[msg.sender][date];
        
        for (uint256 i = 0; i < timeSlots.length; i++) {
            require(timeSlots[i] >= block.timestamp, "Cannot add past time slots");
            professionalAvailability[msg.sender][date].push(TimeSlot(timeSlots[i], false));
        }
        
        emit AvailabilityUpdated(msg.sender, date);
    }

    /**
     * @dev Book a session with a professional
     * @param professional Address of the professional
     * @param date Date of the session
     * @param slotIndex Index of the time slot
     * @param duration Duration in minutes
     * @param sessionType Type of session
     */
    function bookSession(
        address professional,
        uint256 date,
        uint256 slotIndex,
        uint256 duration,
        SessionType sessionType
    ) external payable onlyRegisteredUser nonReentrant {
        require(duration >= minSessionDuration && duration <= maxSessionDuration, "Invalid duration");
        require(slotIndex < professionalAvailability[professional][date].length, "Invalid slot");
        require(!professionalAvailability[professional][date][slotIndex].isBooked, "Slot already booked");
        
        TimeSlot storage slot = professionalAvailability[professional][date][slotIndex];
        require(slot.startTime > block.timestamp, "Cannot book past slots");
        
        // Create session
        Session storage newSession = sessions[nextSessionId];
        newSession.user = msg.sender;
        newSession.professional = professional;
        newSession.scheduledTime = slot.startTime;
        newSession.duration = duration;
        newSession.sessionType = sessionType;
        newSession.amount = msg.value;
        
        // Mark slot as booked
        slot.isBooked = true;
        
        // Add to user and professional session lists
        userSessions[msg.sender].push(nextSessionId);
        professionalSessions[professional].push(nextSessionId);
        
        emit SessionScheduled(nextSessionId, msg.sender, professional);
        nextSessionId++;
    }

    /**
     * @dev Complete a session and update notes
     * @param sessionId ID of the session
     * @param encryptedNotes Encrypted session notes
     */
    function completeSession(uint256 sessionId, bytes32 encryptedNotes) external validSession(sessionId) {
        Session storage session = sessions[sessionId];
        require(session.professional == msg.sender, "Not the session professional");
        require(!session.completed, "Session already completed");
        require(block.timestamp >= session.scheduledTime, "Session not yet started");
        
        // Verify professional status
        (bool isVerified,,,,) = userContract.getProfessionalDetails(msg.sender);
        require(isVerified, "Not a verified professional");
        
        session.completed = true;
        session.encryptedNotes = encryptedNotes;
        
        // Transfer payment to professional
        (bool sent,) = payable(session.professional).call{value: session.amount}("");
        require(sent, "Failed to send payment");
        
        // Update user contract
        userContract.recordSessionCompleted(session.user);
        
        emit SessionCompleted(sessionId);
        emit NotesUpdated(sessionId);
    }

    /**
     * @dev Cancel a session
     * @param sessionId ID of the session to cancel
     */
    function cancelSession(uint256 sessionId) external validSession(sessionId) {
        Session storage session = sessions[sessionId];
        require(msg.sender == session.user || msg.sender == session.professional, "Not authorized");
        require(!session.completed, "Session already completed");
        require(session.scheduledTime > block.timestamp, "Cannot cancel past sessions");
        
        session.cancelled = true;
        
        // Refund user
        (bool sent,) = payable(session.user).call{value: session.amount}("");
        require(sent, "Failed to send refund");
        
        emit SessionCancelled(sessionId);
    }

    /**
     * @dev Get all sessions for a user
     * @param user Address of the user
     */
    function getUserSessions(address user) external view returns (uint256[] memory) {
        return userSessions[user];
    }

    /**
     * @dev Get all sessions for a professional
     * @param professional Address of the professional
     */
    function getProfessionalSessions(address professional) external view returns (uint256[] memory) {
        return professionalSessions[professional];
    }

    /**
     * @dev Get professional's availability for a date
     * @param professional Address of the professional
     * @param date Date to check availability
     */
    function getAvailability(address professional, uint256 date) external view returns (TimeSlot[] memory) {
        return professionalAvailability[professional][date];
    }
}
