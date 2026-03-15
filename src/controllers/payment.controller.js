const paymentModel = require('../models/payment.model')
const bookingModel = require('../models/booking.model')
const razorpay = require('../config/razorpay')
async function createOrder(req,res){
 try{
 const {bookingId}= req.body
 const userId = req.user.id
 const booking = await bookingModel.findById(bookingId)

 if(!booking){
    return res.status(404).json({message:'booking not found'})
 }
 if(booking.userId.toString() !== userId){
    return res.status(403).json({message:'forbidden'})
 }

 if(booking.paymentStatus === "success"){
    return res.status(400).json({
        message:'Booking already paid'
    })
 }

 const amount = booking.price * 100

  const razorpayOrder = await razorpay.orders.create({
    amount:amount ,
    currency:'INR',
    receipt:bookingId
    })
    
const order  = await paymentModel.create({
    userId,
    providerId:booking.providerId ,
    bookingId,
    amount:razorpayOrder.amount,
    currency:razorpayOrder.currency,
    razorpayOrderId:razorpayOrder.id,
    receipt:razorpayOrder.receipt,
    
})
    booking.paymentStatus = 'pending'
    await booking.save()
 return res.status(201).json({
    message:'Order created successfully',
    order
 })}catch(err){
    console.error('create order error:',err);
    return res.status(500).json({message:'Internal server error'})
    
 }
}



module.exports = {
    createOrder
}