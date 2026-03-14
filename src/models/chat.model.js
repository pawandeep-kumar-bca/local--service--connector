const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    messageText: {
      type: String,
      trim: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },

    isRead: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

chatSchema.index({ bookingId: 1, createdAt: 1 });
chatSchema.index({ receiverId: 1, isRead: 1 });

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;