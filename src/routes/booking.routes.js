const express = require('express')

const bookingController = require('../controllers/booking.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

 

router.post('/bookings',authMiddleware.tokenVerify,bookingController.userBookingCreate)

module.exports = router