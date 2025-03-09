"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTemperature } from "@/lib/hooks/useTemperature";
import { useBatch } from "@/lib/hooks/useBatch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TemperatureChart from "@/components/temperature/TemperatureChart";
import TemperatureTable from "@/components/temperature/TemperatureTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TemperatureHistoryPage() {
  const params = useParams();
  const batchId = params.batchId as string;
  const {
    temperatureHistory,
    fetchTemperatureHistory,
    loading,
    error,
    getBreachStatistics,
  } = useTemperature();
  const { fetchBatchById, selectedBatch } = useBatch();
  const [activeView, setActiveView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const loadData = async () => {
      await fetchBatchById(batchId);
      await fetchTemperatureHistory(batchId);
    };

    loadData();
  }, [batchId, fetchBatchById, fetchTemperatureHistory]);

  const stats = getBreachStatistics(temperatureHistory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading temperature history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10 text-red-500">
          <p>Error: {error}</p>
          <Button
            onClick={() => fetchTemperatureHistory(batchId)}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Temperature History
          {selectedBatch && (
            <span className="ml-2 text-gray-500">
              - Batch #{batchId} ({selectedBatch.berry_type})
            </span>
          )}
        </h1>
        <Link href={`/batches/${batchId}`}>
          <Button variant="outline">Back to Batch</Button>
        </Link>
      </div>

      {/* Temperature Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {temperatureHistory.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Breaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.breachCount}
            </div>
            <div className="text-sm text-gray-500">
              {stats.breachPercentage.toFixed(1)}% of readings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Temperature Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.minTemperature.toFixed(1)}°C -{" "}
              {stats.maxTemperature.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageTemperature.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeView === "chart"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200`}
            onClick={() => setActiveView("chart")}
          >
            Chart View
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeView === "table"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200`}
            onClick={() => setActiveView("table")}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Temperature Data */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Readings</CardTitle>
        </CardHeader>
        <CardContent>
          {temperatureHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No temperature data available
            </div>
          ) : activeView === "chart" ? (
            <div className="h-96">
              <TemperatureChart data={temperatureHistory} />
            </div>
          ) : (
            <TemperatureTable data={temperatureHistory} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
