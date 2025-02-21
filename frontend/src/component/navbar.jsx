import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  SignIn,
} from "@clerk/clerk-react";

function NavBar() {
  return (
    <nav className="text-black shadow-lg">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-xl">
              EchoChat
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
                <Link to="/about">About</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link to="/contact">Contact</Link>
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
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
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
