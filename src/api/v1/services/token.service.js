const Token = require('../models/token.model');

const createToken = async(userId, token) => {
    await Token.create({
        userId: userId,
        token: token,
        createdAt: Date.now(),
    });
}

const findToken = async(token) => {
    return await Token.findOne({token})
}

const findTokenAndDelete = async(tokenId) => {
    await Token.findByIdAndDelete(tokenId);
}

module.exports = {
    createToken,
    findToken,
    findTokenAndDelete
}