const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "provider",
    required: true,
  },
  userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user",
   required:true
},
  serviceId: {
     type:mongoose.Schema.Types.ObjectId,
     ref:'category',
     required: true,
  },
  bookingDate: {
    type:Date,
    required: true,
  },
  bookingSlot: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Start","Pending","Reject", "Accepted", "Cancelled", "Completed"],
    default: "Pending",
  },
  serviceAddress: {
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
  },
  price: {
    type: Number,
    required: true, 
  },

},{timestamps:true});

const bookingsModel = new mongoose.model("Booking", bookingsSchema);

module.exports = bookingsModel;
