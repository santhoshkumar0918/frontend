"use client";

import React, { useEffect, useState } from "react";
import { useSystem } from "../../lib/hooks/useSystem";
import { useBatch } from "../../lib/hooks/useBatch";
import BatchList from "../../components/batches/BatchList";
import HealthMetrics from "../../components/system/HealthMetrics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardWrapper from "@/components/layout/DashBoardWrapper";
import { LayoutDashboard, Package, Thermometer, Activity } from "lucide-react";

export default function Dashboard() {
  const {
    healthMetrics,
    agentStatus,
    fetchHealthMetrics,
    startAgent,
    stopAgent,
  } = useSystem();
  const { batches, fetchBatches } = useBatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await Promise.all([fetchHealthMetrics(), fetchBatches()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Set up a refresh interval
    const intervalId = setInterval(() => {
      fetchHealthMetrics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchHealthMetrics, fetchBatches]);

  const handleRefreshHealthMetrics = () => {
    fetchHealthMetrics();
  };

  const handleResetCounters = () => {
    fetchHealthMetrics(true);
  };

  const handleAgentControl = async () => {
    if (agentStatus.running) {
      await stopAgent();
    } else {
      await startAgent();
    }
  };

  if (loading) {
    return (
      <DashboardWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Berry Supply Chain Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Agent Status Card */}
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-blue-500" />
                Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    agentStatus.running ? "bg-green-500" : "bg-red-500"
                  } mb-2`}
                ></div>
                <p className="font-medium">
                  {agentStatus.running ? "Running" : "Stopped"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {agentStatus.name || "No agent loaded"}
                </p>
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

          {/* Batch Stats Card */}
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Batch Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600">
                  {batches.length}
                </div>
                <p className="text-gray-500">Total Batches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-blue-500">
                      {
                        batches.filter((b) => b.batch_status === "InTransit")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-500">In Transit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-500">
                      {
                        batches.filter((b) => b.batch_status === "Delivered")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Stats Card */}
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-blue-500" />
                Temperature Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600">
                  {healthMetrics?.temperature_breaches || 0}
                </div>
                <p className="text-gray-500">Total Breaches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-600">
                      {healthMetrics?.critical_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-500">Critical</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-yellow-600">
                      {healthMetrics?.warning_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-500">Warnings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Stats Card */}
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Blockchain Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600">
                  {healthMetrics?.transaction_count || 0}
                </div>
                <p className="text-gray-500">Transactions</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-600">
                      {healthMetrics?.successful_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-500">Successful</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-600">
                      {healthMetrics?.failed_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-500">Failed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Recent Batches
          </h2>
          <BatchList />
        </div>

        {/* System Health Metrics */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            System Health
          </h2>
          <HealthMetrics
            metrics={healthMetrics || {}}
            onRefresh={handleRefreshHealthMetrics}
            onReset={handleResetCounters}
          />
        </div>
      </div>
    </DashboardWrapper>
  );
}
