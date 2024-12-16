// Enum for Authentication Messages
const AuthMessages = Object.freeze({
    INVALID_CREDENTIALS: "Invalid credentials",
    LOGIN_SUCCESS: "Login successful",
    SERVER_ERROR: "Server error occurred during login",
});

// Enum for JWT Configuration
const JwtConfig = Object.freeze({
    TOKEN_EXPIRY: "1h",
    REFRESH_TOKEN_EXPIRY: "7d",
});

module.exports = { AuthMessages, JwtConfig };
