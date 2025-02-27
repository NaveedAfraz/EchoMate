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
    // consolVe.log(deliveredmessages, "delivered messages");
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
        "UPDATE messages SET ReadReceipts = 'delivered' WHERE receiverId = ? AND ReadReceipts = 'sent'",
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
  function formatLocalDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  socket.on("disconnect", async () => {
    const localDate = formatLocalDate(new Date());
    console.log(localDate, "localDate");
    for (let [userID, socketID] of onlineUsers.entries()) {
      if (socketID === socket.id) {
        try {
          const [response] = await pool.execute(
            "UPDATE participations SET lastSeen = ? WHERE participantID = ?",
            [localDate, userID]
          );
          console.log(response, "response");
        } catch (err) {
          console.error("Error updating online status:", err);
        }
        onlineUsers.delete(userID);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys())); // Update online users list
  });

  socket.on("sendMessage", async (messageData) => {
    console.log("Message received:", messageData);

    // Create a copy of messageData to avoid modifying the original
    let senderMessageData = { ...messageData };
    let recipientMessageData = { ...messageData };

    // Get recipient's socket ID
    const recipientSocketId = onlineUsers.get(messageData.receiverId);

    // If recipient is online, mark as delivered
    if (recipientSocketId) {
      // Update status for recipient's copy
      recipientMessageData.ReadReceipts = "delivered";

      // Also update status for sender's copy so they see "delivered"
      senderMessageData.ReadReceipts = "delivered";

      // Update database
      // try {
      //   await pool.query(
      //     "UPDATE messages SET ReadReceipts = 'delivered' WHERE id = ?",
      //     [messageData.id]
      //   );
      // } catch (err) {
      //   console.error("Error updating message status:", err);
      // }

      // Send to recipient with delivered status
      io.to(recipientSocketId).emit("message", recipientMessageData);
    } else {
      // Recipient offline, keep as "sent"
      senderMessageData.ReadReceipts = "sent";
      console.log("Recipient is offline; message status remains 'sent'");
    }

    // Send back to sender with appropriate status
    socket.emit("message", senderMessageData);
  });
});

module.exports = { io, server, app };
