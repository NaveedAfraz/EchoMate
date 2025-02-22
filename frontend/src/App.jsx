import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import { useUser } from "@clerk/clerk-react";
import Home from "./pages/home";
import DashBoard from "./pages/DashBoard";
function App() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (isSignedIn && location.pathname === "/" || location.pathname === "/login") {
      navigate("/home");
    }
  }, [isSignedIn, navigate, location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<DashBoard />}></Route>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
