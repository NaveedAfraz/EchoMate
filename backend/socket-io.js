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
  // console.log("User connected");

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
    // console.log("read messa  ge ", messageData);

    const result = await pool.query(
      "UPDATE messages SET ReadReceipts = 'read' WHERE receiverId  = ?",
      [messageData.userId]
    );
    // console.log(result, "read message update result");

    io.emit("message-read", {
      conversationId: messageData.conversationId,
      newStatus: "read",
    });
  });

  //this checks if user is online then updates the message status to delivered
  socket.on("message-delivered", async ({ receiverId, senderId }) => {
    // console.log("message delivered", receiverId, senderId);
    try {
      const result = await pool.query(
        "UPDATE messages SET ReadReceipts = 'delivered' WHERE receiverId = ? AND ReadReceipts = 'sent'",
        [receiverId]
      );
      if (result.affectedRows === 0) {
        return; // console.log("No messages found to update");
      }
      // console.log("Message delivered updated:", result);
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
    // console.log(localDate, "localDate");
    for (let [userID, socketID] of onlineUsers.entries()) {
      if (socketID === socket.id) {
        try {
          const [response] = await pool.execute(
            "UPDATE participations SET lastSeen = ? WHERE participantID = ?",
            [localDate, userID]
          );
          // console.log(response, "response");
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
    // Create a copy for the sender response
    let senderMessageData = { ...messageData };
    console.log(messageData, "messageData");

    // Check if this is a group message (receiverId is "group")
    if (messageData.receiverId === "group") {
      // Ensure the sender is in the room for the conversation (group)
      // if (!socket.rooms.has(messageData.conversationId)) {
      //   console.log("Joining room:", messageData.conversationId);

      //   socket.join(messageData.conversationId);
      // }

      // For group messages, we update the message status to 'delivered'
      // For a global group status (i.e. without per-user read receipt), mark as delivered
      let groupMessageData = { ...messageData, ReadReceipts: "delivered" };
      console.log(messageData, "messageData");

      // Broadcast to everyone in the room. Using io.in() sends to all sockets in that room.
      console.log("Emitting message to room:", messageData.conversationId);
      const room = io.sockets.adapter.rooms.get(messageData.conversationId);
      const numClients = room ? room.size : 0;
      console.log(
        `Room ${messageData.conversationId} has ${numClients} clients.`
      );
      io.in(messageData.conversationId).emit("message", groupMessageData);
      // Optionally update the database for the group message status
      // try {
      //   await pool.query(
      //     "UPDATE messages SET ReadReceipts = 'delivered' WHERE conversationID = ? AND id = ?",
      //     [messageData.conversationID, messageData.id]
      //   );
      // } catch (err) {
      //   console.error("Error updating group message status:", err);
      // }
    } else {
      // One-on-one message handling
      const recipientSocketId = onlineUsers.get(messageData.receiverId);
      let recipientMessageData = { ...messageData };
   console.log(recipientSocketId, "recipientSocketId");
   

      if (recipientSocketId) {
        recipientMessageData.ReadReceipts = "delivered";
        senderMessageData.ReadReceipts = "delivered";

        // Send message to the recipient only
        io.to(recipientSocketId).emit("message", recipientMessageData);

        // try {
        //   // Update the database for one-on-one message status
        //   await pool.query(
        //     "UPDATE messages SET ReadReceipts = 'delivered' WHERE id = ?",
        //     [messageData.id]
        //   );
        // } catch (err) {
        //   console.error("Error updating message status:", err);
        // }
      } else {
        // If recipient is offline, the sender message remains 'sent'
        senderMessageData.ReadReceipts = "sent";
      }

      // Send the final status back to the sender
      socket.emit("message", senderMessageData);
    }
  });
  // Listen for joinRoom events from clients
  socket.on("joinRoom", ({ conversationID }) => {
    console.log("joinRoom event received for room:", conversationID);
    // Join the room
    socket.join(conversationID);

    // Check how many clients are in the room
    const room = io.sockets.adapter.rooms.get(conversationID);
    const numClients = room ? room.size : 0;
    console.log(`Room ${conversationID} now has ${numClients} client(s).`);
  });
});

module.exports = { io, server, app };
