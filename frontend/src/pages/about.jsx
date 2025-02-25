import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Users,
  MessageCircle,
  Bell,
  Image,
  Shield,
  Zap,
} from "lucide-react";

function About() {
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      name: "Real-time Chat",
      description: "Instant messaging with real-time updates",
    },
    {
      icon: <Image className="w-6 h-6" />,
      name: "Media Sharing",
      description: "Share images and files seamlessly",
    },
    {
      icon: <Users className="w-6 h-6" />,
      name: "Friend System",
      description: "Connect with friends through requests",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      name: "Notifications",
      description: "Stay updated with instant notifications",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      name: "Secure",
      description: "End-to-end encrypted messages",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      name: "Fast",
      description: "Optimized for quick performance",
    },
  ];

  const stats = [
    { number: "10K+", label: "Users" },
    { number: "1M+", label: "Messages" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About EchoMate
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect, chat, and share with friends in real-time. Experience the
          next generation of messaging.
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
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
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                {tech}
              </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Frontend Developer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
              },
              {
                name: "Jane Smith",
                role: "Backend Developer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
              },
              {
                name: "Mike Johnson",
                role: "UI/UX Designer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <Github className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                  <Twitter className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                  <Linkedin className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:contact@nodify.com"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <a
              href="https://github.com/nodify"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
            <a
              href="https://twitter.com/nodify"
              className="flex items-center text-gray-600 hover:text-gray-900"
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

export default About;
