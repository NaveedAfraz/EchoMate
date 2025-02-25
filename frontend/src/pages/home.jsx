import { SignOutButton, UserButton } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router";
import NavBar from "../components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { homePageData, statistics } from "@/config/cardDetails";
import { Button } from "@/components/ui/button";
import { features } from "@/config/cardDetails";

function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-24 gap-4 h-80">
        <h1 className="text-4xl font-bold">Welcome to EchoMate</h1>
        <p className="text-gray-500 my-2">
          EchoMate is a chat application that allows you to chat with your
          friends and family.
        </p>
        <Button
          variant="default"
          size="lg"
          className="hover:bg-gray-700 my-2 hover:text-white transition-colors duration-200"
        >
          <Link to="/chat">Start Chat</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-6 justify-center items-stretch mt-10 mx-auto max-w-7xl px-4">
        {homePageData.map((item) => (
          <Card
            key={item.id}
            className={`
              ${item.bgColor} 
              ${item.hoverColor} 
              ${item.borderColor}
              transition-all duration-200
              shadow-sm hover:shadow-md
              w-[300px] min-h-[250px]
              flex flex-col justify-between
              hover:scale-105
            `}
          >
            <CardHeader className="space-y-4">
              <div className="text-4xl mb-4">{item.icon}</div>
              <CardTitle className="text-slate-900 text-xl">
                {item.title}
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm min-h-[48px]">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-6">
              <Button
                variant={item.buttonVariant}
                asChild
                className="w-full hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link to={item.link}>{item.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EchoMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statistics.map((stat) => (
              <div key={stat.id} className="text-center p-6">
                <div className="text-4xl mb-4 font-bold">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 italic">
                "EchoMate has transformed how our team communicates. It's simple
                yet powerful!"
              </p>
              <div className="mt-4">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-gray-500 text-sm">Product Manager</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 italic">
                "The best chat application I've used. The interface is clean and
                intuitive."
              </p>
              <div className="mt-4">
                <p className="font-semibold">Mike Chen</p>
                <p className="text-gray-500 text-sm">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EchoChat</h3>
              <p className="text-gray-400">Connecting people worldwide</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-gray-400 hover:text-white"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-gray-400 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-gray-400 hover:text-white"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 EchoChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
