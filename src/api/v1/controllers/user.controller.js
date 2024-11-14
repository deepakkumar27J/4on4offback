const userService = require('../services/user.service');

const createUser = async(req,res) => {
    try {
        console.log("this is controller!");
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
            return res.status(404).json({message: "User not found"});
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
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteUser = async(req,res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message:"User deleted successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getUserRota = async(req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const rota = await userService.calculateRota(user.startDate, user.holidays, req.params.rangeStartDate, req.params.rangeEndDate);
        res.json(rota);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addHoliday = async(req,res) => {
    try {
        const user = await userService.addHoliday(req.body.id, req.body.holidays);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message:"Holidays added successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//TO-DO
const updateHoliday = async(req,res) => {
    try {
        console.log("inside holiday update");
        res.json({message:"UHolidays added successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports= {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserRota,
    addHoliday,
    updateHoliday

}