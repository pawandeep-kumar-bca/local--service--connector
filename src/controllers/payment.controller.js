const paymentModel = require('../models/payment.model')
const bookingModel = require('../models/booking.model')
const razorpay = require('../config/razorpay')
const crypto = require("crypto");
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


async function verifyOrder(req, res) {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // 1️⃣ payment find using razorpayOrderId
    const payment = await paymentModel.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 2️⃣ booking find using payment.bookingId
    const booking = await bookingModel.findById(payment.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 3️⃣ generate signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // 4️⃣ verify signature
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // 5️⃣ update payment document
    payment.paymentStatus = "success";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;

    await payment.save();

    // 6️⃣ update booking
    booking.paymentStatus = "success";
    booking.bookingStatus = "confirmed";

    await booking.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      payment,
      booking,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
    createOrder,
    verifyOrder
}