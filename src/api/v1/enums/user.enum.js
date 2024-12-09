const UserStatus = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
});

// Enum for API Response Codes
const ResponseMessages = Object.freeze({
    USER_NOT_FOUND: "User not found",
    INVALID_VERIFICATION_CODE: "Invalid verification code",
    TOKEN_EXPIRED: "Token expired",
    SUCCESS: "Operation successful",
    FAILURE: "Operation failed",
});

module.exports = { UserStatus, ResponseMessages };