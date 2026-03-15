const express = require('express')
const paymentController = require('../controllers/payment.controller')
const  authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

// POST /api/v1/payments/create-order 

router.post('/create-order',authMiddleware.tokenVerify,paymentController.createOrder)

// POST /api/v1/payments/verify
router.post('/verify',authMiddleware.tokenVerify,paymentController.verifyOrder)
// POST /api/v1/payments/webhook   (Razorpay) 
router.post('/webhook',paymentController.razorpayWebhook)

// GET  /api/v1/payments/history
router.get('/history',authMiddleware.tokenVerify,paymentController.paymentHistory)
module.exports = router