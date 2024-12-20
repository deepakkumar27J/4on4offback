const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});


const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
  
  module.exports = { sendEmail };