const express = require('express')
const paymentController = require('../controllers/payment.controller')
const  authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

// POST /api/v1/payments/create-order 

router.post('/create-order',authMiddleware.tokenVerify,paymentController.createOrder)


module.exports = router