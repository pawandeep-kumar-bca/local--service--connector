const express = require('express')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/profile',authMiddleware.tokenVerify,userController.getUserProfile)

router.put('/profile',authMiddleware.tokenVerify,userController.updateUserProfile)
router.put('/change-password',authMiddleware.tokenVerify,userController.changePassword)




module.exports = router