const express = require('express')
const authController = require('../controllers/auth.controller')
const authValidator = require('../validators/auth.validator')


const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()



/*
*POST /api/v1/auth/register 
**/
router.post('/register',authValidator.registerUserValidation,authController.registerUser)

router.post('/login',authValidator.loginUserValidation,authController.loginUser)
router.post('/refresh-token',authController.refreshToken)

router.post('/logout',authController.logoutUser)

router.get('/me',authMiddleware.tokenVerify,authController.me)

router.get('/verify-email/:token',authController.verifyEmail)
 
router.post('/forgot-password',authController.forgotPassword)
router.get('/reset-password/:token',authController.resetPassword)


module.exports = router