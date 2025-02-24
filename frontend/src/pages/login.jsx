import React from "react";
import NavBar from "../components/navbar";
import { SignIn } from "@clerk/clerk-react";
function Login() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    </>
  );
}

export default Login;
