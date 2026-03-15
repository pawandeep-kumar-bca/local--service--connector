const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Provider',
        required:true
    },

    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking',
        required:true,
        unique:true
    },

    amount:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        enum:['INR','USD'],
        default:'INR'
    },

    receipt:{
        type:String
    },

    razorpayOrderId:{
        type:String
    },

    razorpayPaymentId:{
        type:String
    },

    razorpaySignature:{
        type:String
    },

    paymentStatus:{
        type:String,
        enum:['pending','success','failed','refunded'],
        default:'pending'
    },

    paymentMethod:{
        type:String,
        enum:['upi','card','netBanking','wallet','emi']
    }

},{timestamps:true})

const paymentModel = new mongoose.model('Payment',paymentSchema)

module.exports = paymentModel