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

function App() {
  const { isSignedIn } = useUser();
  const { userId } = useAuth();
  const navigate = useNavigate();

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
          {/* </Route> */}
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
