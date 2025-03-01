import { io } from "socket.io-client";

const socket = io("http://localhost:3006", {
  withCredentials: true,
});

// Add this to debug connection issues
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
