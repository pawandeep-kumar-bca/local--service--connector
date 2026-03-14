const chatModel = require("../models/chat.model");
const bookingModel = require("../models/booking.model");

const { addUser, removeUser, getUserSocket } = require("../utils/socketUsers");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // register user
    socket.on("join", (userId) => {
      addUser(userId, socket.id);
    });

    // join booking room
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

        if (
          senderId !== booking.userId.toString() &&
          senderId !== booking.providerId.toString()
        ) {
          return;
        }

        const message = await chatModel.create({
          bookingId,
          senderId,
          receiverId,
          messageText,
        });

        io.to(bookingId).emit("newMessage", message);

        const receiverSocket = getUserSocket(receiverId);

        if (receiverSocket) {
          io.to(receiverSocket).emit("newNotification", message);
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
