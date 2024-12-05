const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');

const loginUser = async(req,res) => {
    try {
        const { userName, password } = req.body;
        const user = await userService.getUserByEmail(userName);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_TOKEN,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    loginUser
}