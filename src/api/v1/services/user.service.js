const User = require('../models/user.model');

// basic CRUD
const createUser = async(userData) =>{
    let partsCurrent = userData.startDate.split('-');  // Split into day, month, and year
    let formattedStartDate = `${partsCurrent[2]}-${partsCurrent[1]}-${partsCurrent[0]}`;  // Reformat to YYYY-MM-DD
    userData.startDate =  new Date(formattedStartDate);
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
// TO-DO setup alarm based on rota

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    calculateRota
}