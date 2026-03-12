const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'provider',
        required:true
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'booking',
        required:true,
        unique:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true        
    },
    comment:{
        type:String,
        maxlength:200,
        minlength:10
    }
},{timestamps:true})

const reviewModel = new mongoose.model('Review',reviewSchema)

module.exports = reviewModel