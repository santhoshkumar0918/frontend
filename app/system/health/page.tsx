"use client";

import React, { useEffect, useState } from "react";
import { useSystem } from "../../../lib/hooks/useSystem";
import HealthMetrics from "../../../components/system/HealthMetrics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "../../../components/ui/button";

export default function SystemHealthPage() {
  const {
    healthMetrics,
    agentStatus,
    fetchHealthMetrics,
    fetchAgentStatus,
    startAgent,
    stopAgent,
    loading,
    error,
  } = useSystem();
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      await fetchAgentStatus();
      await fetchHealthMetrics();
      setLastRefreshTime(new Date());
    };

    loadData();

    // Set up a refresh interval
    const intervalId = setInterval(() => {
      fetchHealthMetrics();
      setLastRefreshTime(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchAgentStatus, fetchHealthMetrics]);

  const handleRefresh = async () => {
    await fetchHealthMetrics();
    await fetchAgentStatus();
    setLastRefreshTime(new Date());
  };

  const handleResetCounters = async () => {
    await fetchHealthMetrics(true);
    setLastRefreshTime(new Date());
  };

  const handleAgentControl = async () => {
    if (agentStatus.running) {
      await stopAgent();
    } else {
      await startAgent();
    }
    await fetchAgentStatus();
  };

  if (loading && !healthMetrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading system health data...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Health</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Last updated: {lastRefreshTime.toLocaleTimeString()}</span>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {/* Agent Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  agentStatus.running ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              ></div>
              <div>
                <p className="font-medium">
                  Status: {agentStatus.running ? "Running" : "Stopped"}
                </p>
                <p className="text-sm text-gray-500">
                  Agent: {agentStatus.name || "None"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleAgentControl}
              className={
                agentStatus.running
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }
            >
              {agentStatus.running ? "Stop Agent" : "Start Agent"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <HealthMetrics
        metrics={healthMetrics || {}}
        onRefresh={handleRefresh}
        onReset={handleResetCounters}
      />

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              Transaction history viewer coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
