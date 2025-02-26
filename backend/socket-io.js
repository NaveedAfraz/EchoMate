const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const pool = require("./db");
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

  //on log in it updates the messages to delivered
  socket.on("user-online", async (userID) => {
    //  console.log("User online", userID);
    onlineUsers.set(userID, socket.id);
    const [deliveredmessages] = await pool.query(
      "UPDATE messages SET ReadReceipts = 'delivered' WHERE receiverId = ? AND ReadReceipts = 'sent'",
      [userID]
    );
    // console.log(deliveredmessages, "delivered messages");
    socket.emit("delivered-messages", deliveredmessages);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  //on click the chat it updates the messages to read
  socket.on("readMessage", async ({ messageData }) => {
    console.log("read messa  ge ", messageData);

    const result = await pool.query(
      "UPDATE messages SET ReadReceipts = 'read' WHERE receiverId  = ?",
      [messageData.userId]
    );
    console.log(result, "read message update result");

    io.emit("message-read", {
      conversationId: messageData.conversationId,
      newStatus: "read",
    });
  });

  //this checks if user is online then updates the message status to delivered
  socket.on("message-delivered", async ({ receiverId, senderId }) => {
    console.log("message delivered", receiverId, senderId);
    try {
      const result = await pool.query(
        "UPDATE messages SET ReadReceipts = 'delivered' WHERE receiverId = ?",
        [receiverId]
      );
      if (result.affectedRows === 0) {
        return console.log("No messages found to update");
      }
      console.log("Message delivered updated:", result);
    } catch (err) {
      console.error("Error updating delivered status:", err);
    }
  });

  //basically deltes the user online status
  socket.on("disconnect", () => {
    for (let [userID, socketID] of onlineUsers.entries()) {
      if (socketID === socket.id) {
        onlineUsers.delete(userID);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys())); // Update online users list
  });

  socket.on("sendMessage", async (messageData) => {
    console.log("Message received:", messageData);
    io.emit("message", messageData);
  });
});

module.exports = { io, server, app };
