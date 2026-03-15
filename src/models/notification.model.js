const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: [
      "booking_created",
      "booking_cancelled",
      "new_message",
      "new_review",
      "payment_received"
    ],
    default: "new_message"
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },

  relatedModel: {
    type: String,
    enum: ["Booking", "Chat", "Review"]
  },

  isRead: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

const notificationModel = mongoose.model('Notification', notificationSchema)

module.exports = notificationModel