const express = require('express')

const bookingController = require('../controllers/booking.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const BookingValidation = require('../validators/booking.validator')
const router = express.Router()
 
 

router.post('/bookings',authMiddleware.tokenVerify,BookingValidation,bookingController.userBookingCreate)

module.exports = router