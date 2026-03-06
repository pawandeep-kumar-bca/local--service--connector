const express = require('express')
const authController = require('../controllers/auth.controller')
const authValidator = require('../validators/auth.validator')
const router = express.Router()



/*
*POST /api/v1/auth/register 
**/
router.post('/register',authValidator.registerUserValidation,authController.registerUser)

router.post('/login',authValidator.loginUserValidation,authController.loginUser)
router.post('/refresh-token',authController.refreshToken)

router.post('/logout',authController.logoutUser)
module.exports = router