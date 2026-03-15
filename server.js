require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const chatSocket = require("./src/sockets/chat.socket");
const razorpay = require('./src/config/razorpay')

razorpay()
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

chatSocket(io);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});