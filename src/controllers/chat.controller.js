const chatModel = require("../models/chat.model");
const bookingModel = require("../models/booking.model");

async function chatMessages(req, res) {

  try {

    const bookingId = req.params.bookingId;
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "booking not found"
      });
    }

    if (
      userId !== booking.userId.toString() &&
      userId !== booking.providerId.toString()
    ) {
      return res.status(403).json({
        message: "forbidden"
      });
    }

    const chats = await chatModel
      .find({ bookingId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "chats fetched successfully",
      chats
    });

  } catch (err) {

    console.error("chat messages error:", err);

    return res.status(500).json({
      message: "internal server error"
    });

  }

}

async function chatMessagesRead(req, res) {

  try {

    const bookingId = req.params.bookingId;
    const userId = req.userId;

    const result = await chatModel.updateMany(
      {
        bookingId,
        receiverId: userId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    return res.status(200).json({
      message: "messages marked as read",
      updatedMessages: result.modifiedCount
    });

  } catch (err) {

    console.error("read messages error:", err);

    return res.status(500).json({
      message: "internal server error"
    });

  }

}

module.exports = {
  chatMessages,
  chatMessagesRead
};