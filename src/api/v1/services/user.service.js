const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// basic CRUD
const createUser = async(userData) =>{
    let partsCurrent = userData.startDate.split('-');  // Split into day, month, and year
    let formattedStartDate = `${partsCurrent[2]}-${partsCurrent[1]}-${partsCurrent[0]}`;  // Reformat to YYYY-MM-DD
    userData.startDate =  new Date(formattedStartDate);
    userData.password = await bcrypt.hash(userData.password, 10);
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

const calculateRota = async(startDate, holidays = [], rangeStartDate, rangeEndDate) => {
    const rota = [];
    let partsCurrent = rangeStartDate.split('-');  // Split into day, month, and year
    let formattedStartDate = `${partsCurrent[2]}-${partsCurrent[1]}-${partsCurrent[0]}`;  // Reformat to YYYY-MM-DD
    let currentDate = new Date(formattedStartDate);
    const start = new Date(startDate);
    const cycleLength = 8;
    const onDays = 4;

    let parts = rangeEndDate.split('-');  // Split into day, month, and year
    let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;  // Reformat to YYYY-MM-DD
    let endDate = new Date(formattedDate);  // Now this will work 

    const dayOffset = Math.floor(Math.abs(currentDate - start) / (1000 * 60 * 60 * 24)) % cycleLength;
    let isWorking = dayOffset < onDays; // Determine if we start in an "on" phase
    let dayCount = dayOffset % onDays; // Start the count at the correct place in the cycle
    
    // Set of holiday dates for quick lookup
    const holidaySet = new Set(holidays.map(date => new Date(date).toDateString()));
    while (currentDate <= endDate) {
   
        const dateStr = currentDate.toDateString();
        const isHoliday = holidaySet.has(dateStr);
   
        rota.push({
            date: new Date(currentDate),  // Use a new Date object to avoid mutation issues
            onDuty: isWorking && !isHoliday,
            holiday: isHoliday
        });
   
        // Move to the next day by creating a new Date object
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount += 1;
   
        // Toggle between 4-on and 4-off every 4 days
        if (dayCount === onDays) {
            isWorking = !isWorking; // Switch between on/off phase
            dayCount = 0; // Reset day count for the next cycle
        }
    }
    return rota;
}

const addHoliday = async (userId, holidays) => {
    const user = await User.findById(userId);
    holidays.forEach(holiday => {
        let partsCurrent = holiday.split('-');  // Split into day, month, and year
        holiday = `${partsCurrent[2]}-${partsCurrent[1]}-${partsCurrent[0]}`;
        user.holidays.push(holiday);
    });
    user.save();
    return user;
}

const holidays = async (userId) => {
    const user = await User.findById(userId);
    return user.holidays;
}

const getUserByEmail = async(email) => {
   return await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
}

const verifyEmail = async(user)=> {
    user.isEmailVerified = true;
    user.verificationCode = null;
    await user.save();
}

const verificationCode = async(user, verificationCode) => {
    user.verificationCode = verificationCode;
    await user.save();
}

// TO-DO setup alarm based on rota

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    calculateRota,
    addHoliday,
    getUserByEmail,
    holidays,
    verifyEmail,
    verificationCode
}