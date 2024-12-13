const UserStatus = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
});

// Enum for API Response Codes
const ResponseMessages = Object.freeze({
    USER_NOT_FOUND: "User not found",
    INVALID_VERIFICATION_CODE: "Invalid verification code",
    INVALID_TOKEN: "Invalid or expired token",
    TOKEN_EXPIRED: "Token expired",
    SUCCESS: "Operation successful",
    FAILURE: "Operation failed",
});

module.exports = { UserStatus, ResponseMessages };