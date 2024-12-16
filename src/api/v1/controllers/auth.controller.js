const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');
const { AuthMessages, JwtConfig } = require('../enums/auth.enum');

const loginUser = async(req,res) => {
    try {
        const { userName, password } = req.body;
        const user = await userService.getUserByEmail(userName);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: AuthMessages.INVALID_CREDENTIALS });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_TOKEN,
            { expiresIn: JwtConfig.TOKEN_EXPIRY }
        );
        res.status(200).json({ message: AuthMessages.LOGIN_SUCCESS, token });
    } catch (error) {
        res.status(500).json({ message: AuthMessages.SERVER_ERROR, error: error.message });
    }
}

module.exports = {
    loginUser
}