const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateJWT = require('../middlewares/auth.middleware');

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/:id', authenticateJWT, userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.get('/rota/:userId/:rangeStartDate/:rangeEndDate', userController.getUserRota);
router.post('/holiday',userController.addHoliday);
router.get('/holiday/:id',userController.getHoliday);
router.post('/sendVerificationEmail', userController.sendVerificationEmail);
router.post('/verifyEmail', userController.verifyEmail);
router.post('/forgotPassword', userController.forgotPassword);
// router.post('/resetPassword/:token', userController.resetPassword);


module.exports = router;