const onlineUsers = {};

function addUser(userId, socketId) {
  onlineUsers[userId] = socketId;
}

function removeUser(socketId) {
  for (let userId in onlineUsers) {
    if (onlineUsers[userId] === socketId) {
      delete onlineUsers[userId];
    }
  }
}

function getUserSocket(userId) {
  return onlineUsers[userId];
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = {
  addUser,
  removeUser,
  getUserSocket,
  getOnlineUsers
};