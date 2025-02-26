import React from "react";
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
  const handleLogout = async () => {
    try {
      const localDate = formatLocalDate(new Date());
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
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link to="/home">Home</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link
                  to="/about"
                  className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  About
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <SignedOut>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
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
