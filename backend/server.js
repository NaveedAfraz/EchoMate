const express = require("express");
// const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { io, server, app } = require("./socket-io");
dotenv.config();
app.use(express.json());
const { requireAuth } = require("@clerk/express");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api", requireAuth());
const imgRoute = require("./helper/imageUpload");
const userRoute = require("./router/chat/chats");
const nodificationRoute = require("./router/notification/notification");
const messageRoute = require("./router/chat/messages");

app.use("/api/imageUpload", imgRoute);
app.use("/api/users", userRoute);
app.use("/api/notification", nodificationRoute);
app.use("/api/messages", messageRoute);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
