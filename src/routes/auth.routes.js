const express = require('express')
const authController = require('../controllers/auth.controller')
const authValidator = require('../validators/auth.validator')
const router = express.Router()



/** 
*POST /api/v1/auth/register 
**/
router.post('/register',authValidator.registerValidation,authController.registerUser)



module.exports = router