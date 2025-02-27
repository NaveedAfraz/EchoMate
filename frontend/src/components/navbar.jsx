import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";

function NavBar() {
  const clerk = useClerk();
  const [activeBar, setActiveBar] = useState("");

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const handleLogout = async () => {
    try {
      const localDate = new Date().toISOString().slice(0, 19).replace("T", " ");
      console.log(localDate, "localDate");

      const response = await fetch(
        "http://localhost:3006/api/users/sendlastSeen",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lastSeen: localDate,
            userId: clerk.user?.id,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update last seen");
      }
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
    setTimeout(() => clerk.signOut(), 100);
  };

  return (
    <nav className="text-black shadow-lg">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-xl">
              EchoMate
            </Link>
          </div>

          <div className="hidden text-black md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="lg"
                  asChild
                  className={`hover:bg-gray-700 ${
                    activeBar === link.name
                      ? "bg-black text-white"
                      : "text-black"
                  } hover:text-white transition-colors duration-200`}
                  onClick={() => setActiveBar(link.name)}
                >
                  <Link to={link.path}>{link.name}</Link>
                </Button>
              ))}

              <SignedOut>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  onClick={() => setActiveBar("login")}
                  className={`hover:bg-gray-700 ${
                    activeBar === "login" ? "bg-black text-white" : "text-black"
                  } hover:text-white transition-colors duration-200`}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="lg"
                  className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  Logout
                </Button>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
