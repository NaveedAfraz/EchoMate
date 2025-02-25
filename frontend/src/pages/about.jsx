import React from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Image,
  Users,
  Bell,
  Shield,
  Zap,
} from "lucide-react";
import { aboutStats, aboutFeatures } from "../config/cardDetails";
import { Link } from "react-router";
// Create an icon map
const iconMap = {
  MessageCircle: MessageCircle,
  Image: Image,
  Users: Users,
  Bell: Bell,
  Shield: Shield,
  Zap: Zap,
};

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-20 text-center animate-fade-in-down">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About EchoMate
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect, chat, and share with friends in real-time. Experience the
          next generation of messaging.
        </p>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutStats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition duration-500 ease-in-out hover:scale-105 opacity-0 animate-fade-in`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutFeatures.map((feature, index) => {
              const IconComponent = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow transform transition duration-500 ease-in-out hover:translate-y-1 opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="text-blue-600 mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              "React",
              "Node.js",
              "Socket.IO",
              "Redux",
              "MySQL",
              "Tailwind CSS",
              "Clerk Auth",
              "Express",
            ].map((tech, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm text-center hover:shadow-md transition-shadow opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className=" gap-8  items-center justify-center flex ">
            {[
              {
                name: "Naveed Afraz",
                role: "Full Stack Developer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveed",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl w-sm text-center transform transition duration-500 ease-in-out hover:scale-105 opacity-0 animate-scale-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://github.com/NaveedAfraz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/NaveedAfraz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/NaveedAfraz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-black text-white animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:contact@echoMate.com"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <a
              href="https://github.com/NaveedAfraz"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
            <a
              href="https://twitter.com/NaveedAfraz"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Tailwind CSS animations via custom styles
// You would add these to your global CSS file or tailwind.config.js
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-fade-in-down {
    animation: fadeInDown 0.5s ease-in-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-in-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.5s ease-in-out;
  }
`;
document.head.appendChild(styleTag);

export default About;
