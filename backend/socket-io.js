const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("user-online", (userID) => {
    onlineUsers.set(userID, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys())); // Send online users list
  });
  socket.on("disconnect", () => {
    for (let [userID, socketID] of onlineUsers.entries()) {
      if (socketID === socket.id) {
        onlineUsers.delete(userID);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys())); // Update online users list
  });

  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);
    io.emit("message", messageData); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { io, server, app };
