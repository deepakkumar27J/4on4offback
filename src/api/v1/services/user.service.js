const User = require('../models/user.model');

// basic CRUD
const createUser = async(userData) =>{
    console.log("this is service!");
    const user = new User(userData);
    return await user.save();
}

const getUserById = async(userId) => {
    return await User.findById(userId);
}

const updateUser = async(userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, {new:true});
}

const deleteUser = async(userId) => {
    return await User.findByIdAndDelete(userId);
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
}