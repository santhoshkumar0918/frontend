"use client";

import React, { useState } from "react";
import { Bot, MenuIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ConnectWallet from "../wallet/ConnectWallet";
import { useSystem } from "../../lib/hooks/useSystem";

const Header = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { agentStatus } = useSystem();

  const navLinks = [
    { name: "home", label: "Home", href: "/" },
    { name: "dashboard", label: "Dashboard", href: "/dashboard" },
    { name: "batches", label: "Batches", href: "/batches" },
    { name: "createBatch", label: "Create Batch", href: "/batches/create" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-[11vh] bg-gray-900/80 backdrop-blur-lg z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              SupplyChAin
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <div
              key={link.name}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative flex items-center"
            >
              <Link
                href={link.href}
                className="text-gray-200 hover:text-white transition duration-300 text-lg font-medium px-2 py-1"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Agent Status Indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
            <div
              className={`w-2 h-2 rounded-full ${
                agentStatus?.running ? "bg-green-500" : "bg-red-500"
              } mr-2`}
            ></div>
            <span className="text-xs text-gray-300">
              {agentStatus?.running ? "Agent Active" : "Agent Inactive"}
            </span>
          </div>
          <ConnectWallet />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Animated Underline - Keep this from original design */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ x: "-100%" }}
        animate={{
          x:
            hoveredLink === "home"
              ? "-50%"
              : hoveredLink === "features"
              ? "-25%"
              : hoveredLink === "dashboard"
              ? "0%"
              : hoveredLink === "batches"
              ? "25%"
              : hoveredLink === "createBatch"
              ? "50%"
              : "0%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-[11vh] left-0 w-full bg-gray-900 shadow-lg z-50"
        >
          <div className="py-4 px-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-200 hover:text-white py-3 px-4 border-b border-gray-800"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-4 px-4">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    agentStatus?.running ? "bg-green-500" : "bg-red-500"
                  } mr-2`}
                ></div>
                <span className="text-xs text-gray-300">
                  {agentStatus?.running ? "Agent Active" : "Agent Inactive"}
                </span>
              </div>
              <ConnectWallet />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
