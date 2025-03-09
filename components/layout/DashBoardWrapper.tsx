"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { loadAndStartAgent } from "../../lib/utils/agentLoader";
import { useSystem } from "../../lib/hooks/useSystem";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const router = useRouter();
  const { agentStatus, startAgent } = useSystem();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const result = await loadAndStartAgent();

        if (result.success) {
          // Check if sonic connection exists
          if (result.connections && !result.connections.sonic) {
            setError(
              "The 'sonic' connection is missing. Check your agent configuration."
            );
          } else {
            // All good!
            setLoading(false);
          }
        } else {
          setError(result.message);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize dashboard:", err);
        setError(
          "Failed to connect to agent server. Please ensure the server is running."
        );
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  const handleStartAgent = async () => {
    try {
      setLoading(true);
      await startAgent();
      setLoading(false);
    } catch (err) {
      console.error("Failed to start agent:", err);
      setError("Failed to start agent. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-xl">Connecting to Agent Server...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="bg-red-900/30 p-8 rounded-lg border border-red-800 max-w-md text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
              <p className="mb-4">{error}</p>
              <p className="text-sm mb-6">
                Make sure your agent server is running at the specified URL.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Return Home
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!agentStatus?.running) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="bg-yellow-900/30 p-8 rounded-lg border border-yellow-800 max-w-md text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Agent Not Running</h3>
              <p className="mb-6">
                The berry monitoring agent is not currently running. Start the
                agent to access all features.
              </p>
              <Button
                onClick={handleStartAgent}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Start Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">{children}</div>
    </div>
  );
}
