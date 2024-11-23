const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/login', authController.loginUser);
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }), // Disable sessions
    (req, res) => {
        const { token } = req.user;
        res.status(200).json({ message: "Login successful", token });
    }
);

module.exports = router;