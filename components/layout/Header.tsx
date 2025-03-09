"use client";

import React, { useState } from "react";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ConnectWallet from "../wallet/ConnectWallet";

const Header = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 w-full h-[11vh] bg-gray-950 bg-opacity-60 backdrop-blur-lg shadow-lg z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex items-center">
          <div className="text-blue-500 font-bold text-2xl flex items-center gap-2">
            <Bot className="h-8 w-8" />
            SupplyChAin
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <div
            onMouseEnter={() => setHoveredLink("home")}
            onMouseLeave={() => setHoveredLink(null)}
            className="relative flex items-center"
          >
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition duration-300 text-lg"
            >
              Home
            </Link>
          </div>

          <div
            onMouseEnter={() => setHoveredLink("features")}
            onMouseLeave={() => setHoveredLink(null)}
            className="relative flex items-center"
          >
            <Link
              href="/features"
              className="text-gray-300 hover:text-white transition duration-300 text-lg"
            >
              Features
            </Link>
          </div>

          <div
            onMouseEnter={() => setHoveredLink("dashboard")}
            onMouseLeave={() => setHoveredLink(null)}
            className="relative flex items-center"
          >
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition duration-300 text-lg"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        <div className="hidden md:flex items-center">
          <ConnectWallet />
        </div>
      </div>

      {/* Animated Underline */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ x: "-100%" }}
        animate={{
          x:
            hoveredLink === "home"
              ? "-25%"
              : hoveredLink === "features"
              ? "0%"
              : hoveredLink === "dashboard"
              ? "25%"
              : "0%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </header>
  );
};

export default Header;
