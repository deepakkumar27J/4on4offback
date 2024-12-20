const userService = require('../services/user.service');
const {sendEmail} = require('./../services/email.service');
const Token = require('./../models/token.model');
const tokenService = require('./../services/token.service');
const { ResponseMessages } = require('../utils/enums');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const createUser = async(req,res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getUserById = async(req,res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateUser = async(req,res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({message: ResponseMessages.FAILURE, error: error.message});
    }
}

const deleteUser = async(req,res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        res.json({message:ResponseMessages.SUCCESS});
    } catch (error) {
        res.status(400).json({message: ResponseMessages.FAILURE, error: error.message});
    }
}

const getUserRota = async(req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        const rota = await userService.calculateRota(user.startDate, user.holidays, req.params.rangeStartDate, req.params.rangeEndDate);
        res.json(rota);
    } catch (error) {
        res.status(400).json({message: ResponseMessages.FAILURE, error: error.message});
    }
}

const addHoliday = async(req,res) => {
    try {
        const user = await userService.addHoliday(req.body.id, req.body.holidays);
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        res.json({message:"Holidays added successfully"});
    } catch (error) {
        res.status(400).json({message: ResponseMessages.FAILURE, error: error.message});
    }
}

const getHoliday = async(req,res) => {
    try {
        const holidays = await userService.getHoliday(req.body.id);
        if(!holidays){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }
        res.json(holidays);
    } catch (error) {
        res.status(400).json({message: ResponseMessages.FAILURE, error: error.message});
    }
}

//TO-DO
const updateHoliday = async(req,res) => {
    try {
        res.json({message:ResponseMessages.SUCCESS});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const sendVerificationEmail = async(req, res) => {
    try {
        const {email} = req.body;
        const user = await userService.getUserByEmail( email );
        if (!user) {
        return res.status(400).json({ message: ResponseMessages.USER_NOT_FOUND });
        }
        // Generate random verification code
        const verificationCode = crypto.randomBytes(3).toString('hex');
        await userService.verificationCode(user, verificationCode);
        
        const subject = 'Verify Your Email Address';
        const text = `Your verification code is: ${verificationCode}`;
        const html = `<p>Your verification code is: <b>${verificationCode}</b></p>`;

        await sendEmail(email, subject, text, html);
        res.status(200).json({ message: ResponseMessages.SUCCESS });

    } catch (error) {
        console.error('Error in sendVerificationEmail:', error);
        res.status(500).json({ message: ResponseMessages.FAILURE, error: error.message });
    }
}

const verifyEmail = async(req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const user = await userService.getUserByEmail( email );
        if (!user || user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: ResponseMessages.INVALID_VERIFICATION_CODE });
        }
        await userService.verifyEmail(user);
        res.status(200).json({ message: ResponseMessages.SUCCESS });

    } catch (error) {
        console.error('Error in Verify Email:', error);
        res.status(500).json({ message: ResponseMessages.FAILURE, error: error.message });
    }
}

const forgotPassword = async(req,res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: ResponseMessages.USER_NOT_FOUND });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        await tokenService.createToken(user._id, resetToken)

        const resetLink = `${process.env.FORGOT_PASS}${resetToken}`;
        const subject = 'Password Reset Request';
        const text =  `You requested a password reset. Click the link to reset your password: ${resetLink}`;
        const html = `<p>Click the link to reset your password: <a href="${resetLink}" target="_blank">${resetLink}</a></p>`;

        await sendEmail(email, subject, text, html);

        res.status(200).json({ message: ResponseMessages.SUCCESS });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: ResponseMessages.FAILURE, error: error.message });
    }
}

const resetPassword = async(req, res) => {
    try {
        const { token, newPassword } = req.body;

        const resetToken = await tokenService.findToken(token);
        if (!resetToken) {
            return res.status(400).json({ message: ResponseMessages.INVALID_TOKEN });
        }

        const tokenLifetime = 3600000;
        if (Date.now() - resetToken.createdAt > tokenLifetime) {
            return res.status(400).json({ message: ResponseMessages.TOKEN_EXPIRED });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userService.updateUser(resetToken.userId, {password:hashedPassword});
        if(!user){
            return res.status(404).json({message: ResponseMessages.USER_NOT_FOUND});
        }

        await tokenService.findTokenAndDelete(resetToken.id);
        res.status(200).json({ message: ResponseMessages.SUCCESS });
    } catch (error) {
        console.error('Error resetting the password:', error);
        res.status(500).json({ message: ResponseMessages.FAILURE, error: error.message });
    }
}


module.exports= {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserRota,
    addHoliday,
    updateHoliday,
    getHoliday,
    sendVerificationEmail,
    verifyEmail,
    forgotPassword,
    resetPassword

}