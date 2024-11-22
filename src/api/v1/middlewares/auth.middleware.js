const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateJWT;