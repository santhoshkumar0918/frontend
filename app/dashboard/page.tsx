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
import { Activity, LayoutDashboard, Package, Thermometer } from "lucide-react";

export default function Dashboard() {
  const {
    healthMetrics,
    fetchHealthMetrics,
    loading: systemLoading,
  } = useSystem();
  const { batches, fetchBatches, loading: batchLoading } = useBatch();
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

  if (loading || systemLoading || batchLoading) {
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
        <h1 className="text-3xl font-bold mb-8 text-white">
          Berry Supply Chain Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Batch Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-400" />
                Batch Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400">
                  {batches.length}
                </div>
                <p className="text-gray-400">Total Batches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-blue-400">
                      {
                        batches.filter((b) => b.batch_status === "InTransit")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-400">In Transit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-400">
                      {
                        batches.filter((b) => b.batch_status === "Delivered")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-blue-400" />
                Temperature Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400">
                  {healthMetrics?.temperature_breaches || 0}
                </div>
                <p className="text-gray-400">Total Breaches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-400">
                      {healthMetrics?.critical_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-400">Critical</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-yellow-400">
                      {healthMetrics?.warning_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-400">Warnings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-400" />
                Blockchain Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400">
                  {healthMetrics?.transaction_count || 0}
                </div>
                <p className="text-gray-400">Transactions</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-400">
                      {healthMetrics?.successful_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-400">Successful</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-400">
                      {healthMetrics?.failed_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Quality Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-blue-400" />
                Quality Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-900/50 border border-blue-400 flex items-center justify-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
                <p className="text-gray-400">Quality Monitoring</p>
                <div className="mt-2 text-sm font-semibold text-blue-400">
                  Active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Recent Batches</h2>
          <BatchList />
        </div>

        {/* System Health Metrics */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">System Health</h2>
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
