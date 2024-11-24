const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true  },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                // Password is required only if googleId is not present
                if (!this.googleId && !value) {
                    return false; // Invalid if no password and no googleId
                }
                return true;
            },
            message: 'Password is required unless signed up with Google',
        },
    },
    googleId: { type: String },
    startDate: { type: Date, required: true },
    holidays: [{ type: Date }],
    createdAt: {type: Date, default: Date.now},
    verificationCode: { type: String },
    isEmailVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);