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
import { useUser } from "@clerk/clerk-react";
import Home from "./pages/home";
import DashBoard from "./pages/DashBoard";
import NavBar from "./component/navbar";

function App() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (isSignedIn && location.pathname === "/" || location.pathname === "/login") {
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

  return (
    <>
      <Routes>
        <Route path="/" element={<NavOutlet />}>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Sign_Up/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
