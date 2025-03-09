"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex flex-1">
        <Sidebar />
        <div className="ml-64 w-full pt-[11vh]">
          {" "}
          {/* Adjust ml-64 to ml-20 when sidebar is collapsed */}
          <main className="p-6 bg-gray-100 min-h-[calc(100vh-11vh-200px)]">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
