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
      <div className="flex flex-col items-center text-center justify-center mt-11 gap-4 h-80 animate-fade-in-down">
        <h1 className="text-5xl  font-bold">Welcome to EchoMate</h1>
        <p className="text-gray-500 my-2">
          EchoMate is a chat application that allows you to chat with your
          friends and family.
        </p>
        <Button
          variant="default"
          size="lg"
          className="hover:bg-gray-700 my-2 hover:text-white transition-colors duration-200 animate-pulse"
        >
          <Link to="/dashboard">Start Chat</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-6 justify-center items-stretch mt-10 mx-auto max-w-7xl px-4">
        {homePageData.map((item, index) => (
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
              opacity-0 animate-fade-in-up
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <CardHeader className="space-y-4">
              <div className="text-4xl mb-4  ">{item.icon}</div>
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
                className="w-full  hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <Link to={item.link}>{item.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            Why Choose EchoMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="text-center p-6 opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
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
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            Our Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statistics.map((stat, index) => (
              <div
                key={stat.id}
                className="text-center p-6 transform transition duration-500 ease-in-out hover:scale-105 opacity-0 animate-scale-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="text-4xl mb-4 font-bold text-blue-600">
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="bg-white p-6 rounded-lg shadow opacity-0 animate-slide-in-left"
              style={{ animationFillMode: "forwards" }}
            >
              <p className="text-gray-600 italic">
                "EchoMate has transformed how our team communicates. It's simple
                yet powerful!"
              </p>
              <div className="mt-4">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-gray-500 text-sm">Product Manager</p>
              </div>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow opacity-0 animate-slide-in-right"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
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
      <footer className="border-t bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div>
              <h3 className="text-lg font-semibold">EchoMate</h3>
              <p className="text-sm text-gray-600">
                Connect and chat seamlessly
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-8">
              <Link to="/about" className="text-sm">
                About
              </Link>
              <a href="mailto:support@echoMate.com" className="text-sm">
                Contact
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 text-center text-sm">
            © {new Date().getFullYear()} EchoMate. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-in-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-in-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-in-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-in-out;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
}

export default Home;
