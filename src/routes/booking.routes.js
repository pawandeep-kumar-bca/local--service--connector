const express = require('express')

const bookingController = require('../controllers/booking.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const BookingValidation = require('../validators/booking.validator')
const validateObjectId = require('../middlewares/validateObjectId.middleware')
const router = express.Router()
 
 

router.post('/',authMiddleware.tokenVerify,BookingValidation,bookingController.userBookingCreate)
// GET    /api/v1/bookings

router.get('/',authMiddleware.tokenVerify,bookingController.getUserAllBooking)
// GET    /api/v1/bookings/:id
router.get('/:id',authMiddleware.tokenVerify,validateObjectId,bookingController.getUserOneBooking)
module.exports = router