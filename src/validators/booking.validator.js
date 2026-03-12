 const {body,validationResult} = require("express-validator")
 
 async function ResponseWithBookingValidation(req,res,next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    }
    next()
 }

 const BookingValidation = [

    body("providerId").notEmpty().withMessage('providerId is required'),
    body("serviceId").notEmpty().withMessage('serviceId is required'),
    body("bookingDate").notEmpty().withMessage('bookingDate is required').isDate().withMessage('please enter a valid date'),
    body("bookingSlot").notEmpty().withMessage('bookingSlot is required'),
    body("serviceAddress.city").notEmpty().withMessage('city is required'),
    body("serviceAddress.pinCode").notEmpty().withMessage('pinCode is required').isLength({min:6,max:6}).withMessage('please enter a 6 digit of pin code'),
    body("serviceAddress.village").notEmpty().withMessage('village is required'),

    ResponseWithBookingValidation
]

module.exports = BookingValidation