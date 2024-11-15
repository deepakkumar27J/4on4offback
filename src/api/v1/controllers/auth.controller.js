const userService = require('../services/user.service');

const loginUser = async(req,res) => {
    try {
        const { userName, password } = req.body;
        const user = await userService.getUserByEmail(userName);
        if (!user || !(user.password == password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // TO-DO Generate a token (JWT in this case) if login is successful
        const token = "2343423b23432b34532b6";
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    loginUser
}