import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router";
import Login from "./pages/login";
import Sign_Up from "./pages/sign-up";
import { useAuth, useUser } from "@clerk/clerk-react";
import Home from "./pages/home";
import DashBoard from "./pages/DashBoard";
import NavBar from "./components/navbar";
import Chat from "./components/chat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Nodifications from "./pages/nodifications";
import { setOnlineUsers } from "./store/messages";
import { useDispatch, useSelector } from "react-redux";
import socket from "../helper/socket";
import About from "./pages/about";

function App() {
  const { isSignedIn } = useUser();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(() => {
    if (
      (isSignedIn && location.pathname === "/") ||
      (location.pathname === "/login" && userId) ||
      location.pathname === "/"
    ) {
      navigate("/home");
    }
  }, [isSignedIn, navigate, location.pathname]);

  const NavOutlet = () => {
    return (
      <>
        <NavBar />
        <Outlet />
      </>
    );
  };
  const queryClient = new QueryClient();

  useEffect(() => {
    // Connect user when they log in
    if (userId) {
      console.log("userId", userId);
      // socket.emit("updateReadReceipts", receiveredID);
      socket.emit("user-online", userId);
    }

    // Listen for online users updates
    socket.on("online-users", (users) => {
      console.log(users, "users");

      dispatch(setOnlineUsers(users));
    });

    // Cleanup: emit offline event when component unmounts or user logs out
    return () => {
      if (userId) {
        socket.emit("user-offline", userId);
      }
      socket.off("online-users");
    };
  }, [userId, dispatch]);

  // Watch for sign out
  useEffect(() => {
    if (!isSignedIn && userId) {
      socket.emit("user-offline", userId);
      dispatch(setOnlineUsers([])); // Clear online users on logout
    }
  }, [isSignedIn, userId, dispatch]);

  // console.log("Socket instance:", socket);

  useEffect(() => {
    socket.on("message", (messageData) => {
      console.log("New message received:", messageData);
      // Check if the message is for the current user
      if (messageData.receiverId === userId) {
        console.log("Message is for the current user");
        socket.emit("message-delivered", {
          receiverId: messageData.receiverId,
          senderId: messageData.senderId,
        });
      }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("message");
    };
  }, [userId, dispatch]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Routes>
          {/* <Route path="/" element={<NavOutlet />}> */}

          <Route path="/dashboard" element={<DashBoard />}>
            <Route path="chat/:userName/:receiverID" element={<Chat />} />
          </Route>

          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Nodifications />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Sign_Up />} />
          <Route path="/about" element={<About />} />
          {/* </Route> */}
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
