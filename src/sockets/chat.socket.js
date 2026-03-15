const chatModel = require("../models/chat.model");
const bookingModel = require("../models/booking.model");
const notificationModel = require("../models/notification.model");

const { addUser, removeUser, getUserSocket } = require("../utils/socketUsers");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // register user
    socket.on("join", (userId) => {
      addUser(userId, socket.id);
    });

    // join booking chat room
    socket.on("joinChat", (bookingId) => {
      socket.join(bookingId);
    });

    // send message
    socket.on("sendMessage", async (data) => {
      try {
        const { bookingId, senderId, receiverId, messageText } = data;

        if (!messageText) return;

        const booking = await bookingModel.findById(bookingId);
        if (!booking) return;

        // check sender is part of booking
        if (
          senderId !== booking.userId.toString() &&
          senderId !== booking.providerId.toString()
        ) {
          return;
        }

        // save chat message
        const message = await chatModel.create({
          bookingId,
          senderId,
          receiverId,
          messageText,
        });

        // emit message to chat room
        io.to(bookingId).emit("newMessage", message);

        // create notification in DB
        const notification = await notificationModel.create({
          receiverId: receiverId,
          senderId: senderId,
          type: "new_message",
          title: "New Message",
          message: "You received a new message",
          relatedId: bookingId,
          relatedModel: "Chat",
        });

        // send real-time notification if receiver online
        const receiverSocket = getUserSocket(receiverId);

        if (receiverSocket) {
          io.to(receiverSocket).emit("newNotification", notification);
        }
      } catch (err) {
        console.error("sendMessage socket error:", err);
      }
    });

    // typing indicator
    socket.on("typing", (bookingId) => {
      socket.to(bookingId).emit("typing");
    });

    socket.on("stopTyping", (bookingId) => {
      socket.to(bookingId).emit("stopTyping");
    });

    // mark messages read
    socket.on("readMessages", async ({ bookingId, userId }) => {
      try {
        await chatModel.updateMany(
          {
            bookingId,
            receiverId: userId,
            isRead: false,
          },
          {
            $set: { isRead: true },
          },
        );

        io.to(bookingId).emit("messagesRead", {
          bookingId,
          userId,
        });
      } catch (err) {
        console.error("readMessages error:", err);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = chatSocket;
