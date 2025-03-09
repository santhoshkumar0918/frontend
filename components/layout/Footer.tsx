"use client";

import React from "react";
import { Bot, Github } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xl mb-4">
              <Bot className="h-6 w-6" />
              <span>SupplyChAin</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              A blockchain-powered solution for monitoring temperature-sensitive
              berry shipments. Ensure quality and traceability throughout your
              supply chain.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/batches"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Manage Batches
                </Link>
              </li>
              <li>
                <Link
                  href="/batches/create"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Create New Batch
                </Link>
              </li>
              <li>
                <Link
                  href="/temperature/record"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Record Temperature
                </Link>
              </li>
              <li>
                <Link
                  href="/system/health"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  System Health
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">System Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Built with Next.js and Tailwind CSS</p>
              <p>Connected to Sonic Blockchain</p>
              <p>Temperature Monitoring Agent: v1.0.0</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
          <p>
            &copy; {new Date().getFullYear()} Berry Supply Chain Monitoring. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
