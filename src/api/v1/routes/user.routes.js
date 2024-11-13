const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.get('/rota/:userId/:rangeStartDate/:rangeEndDate', (req, res, next) => {
    console.log("Route /api/v1/users/rota was hit");
    next();
}, userController.getUserRota);

module.exports = router;