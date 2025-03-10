"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBatch } from "../../lib/hooks/useBatch";
import { useTemperature } from "../../lib/hooks/useTemperature";
import { useQuality } from "../../lib/hooks/useQuality";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TemperatureChart from "../temperature/TemperatureChart";
import QualityIndicator from "../quality/QualityIndicator";
import Link from "next/link";

interface BatchDetailViewProps {
  batchId: string;
}

const BatchDetailView: React.FC<BatchDetailViewProps> = ({ batchId }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const {
    loading: batchLoading,
    error: batchError,
    fetchBatchById,
    fetchBatchReport,
    selectedBatch,
    batchReport,
    completeBatch,
  } = useBatch();

  const { fetchTemperatureHistory, temperatureHistory, getBreachStatistics } =
    useTemperature();

  const {
    assessQuality,
    qualityAssessment,
    getQualityCategory,
    getActionColor,
  } = useQuality();

  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let isCancelled = false;
    setIsLoading(true);
    setLoadError(null);

    const loadBatchData = async () => {
      try {
        console.log(
          `Loading data for batch ID: ${batchId} (Attempt ${retryCount + 1})`
        );

        // Try to fetch the batch data
        const batchResult = await fetchBatchById(batchId);

        // If batch fetch failed and we haven't exceeded max retries
        if (!batchResult && retryCount < MAX_RETRIES) {
          console.log(
            `Batch fetch failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`
          );
          // Schedule retry after delay
          if (!isCancelled) {
            setRetryCount((prev) => prev + 1);
          }
          return;
        }

        // If batch fetch failed after all retries
        if (!batchResult) {
          throw new Error(
            `Failed to fetch batch with ID ${batchId} after ${MAX_RETRIES} attempts`
          );
        }

        // Only proceed with additional data fetching if batch data was found
        if (!isCancelled) {
          console.log(
            `Successfully fetched batch ${batchId}, fetching additional data...`
          );

          // Use Promise.allSettled to fetch all related data in parallel
          // This ensures that if one fetch fails, others will still complete
          const [reportResult, tempHistoryResult, qualityResult] =
            await Promise.allSettled([
              fetchBatchReport(batchId),
              fetchTemperatureHistory(batchId),
              assessQuality(batchId),
            ]);

          // Log the results of each fetch
          console.log("Batch report fetch result:", reportResult);
          console.log("Temperature history fetch result:", tempHistoryResult);
          console.log("Quality assessment result:", qualityResult);

          // Complete loading
          if (!isCancelled) {
            setIsLoading(false);
            setLoadError(null);
          }
        }
      } catch (error) {
        console.error("Error loading batch data:", error);
        if (!isCancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unknown error loading batch data"
          );
          setIsLoading(false);
        }
      }
    };

    // Short delay before loading to allow for any state updates
    const timeoutId = setTimeout(loadBatchData, 500);

    // Cleanup function
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    batchId,
    fetchBatchById,
    fetchBatchReport,
    fetchTemperatureHistory,
    assessQuality,
    isMounted,
    retryCount,
  ]);

  // Effect for automatic retry with increasing delay
  useEffect(() => {
    if (retryCount > 0 && retryCount <= MAX_RETRIES && isMounted) {
      const retryDelay = 1000 * Math.pow(2, retryCount - 1); // Exponential backoff
      console.log(`Scheduling retry ${retryCount} in ${retryDelay}ms...`);

      const timeoutId = setTimeout(() => {
        console.log(`Executing retry ${retryCount}...`);
        // This empty update will trigger the main data loading effect
        setRetryCount(retryCount);
      }, retryDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [retryCount, isMounted]);

  const handleCompleteBatch = async () => {
    if (!isMounted) return;

    if (window.confirm("Are you sure you want to complete this shipment?")) {
      setCompleting(true);
      try {
        const result = await completeBatch(batchId);
        if (result) {
          alert("Shipment completed successfully!");
          router.push("/batches");
        }
      } catch (error) {
        console.error("Error completing batch:", error);
        alert("Error completing batch. See console for details.");
      } finally {
        setCompleting(false);
      }
    }
  };

  const handleManualRetry = async () => {
    setIsLoading(true);
    setLoadError(null);
    setRetryCount(0);
  };

  const handleBackToBatches = () => {
    router.push("/batches");
  };

  // Show loading state while data is being fetched
  if (!isMounted || isLoading || batchLoading) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Loading batch details...</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500">
            Retry attempt {retryCount} of {MAX_RETRIES}...
          </p>
        )}
      </div>
    );
  }

  // Show error state if there was an error loading the batch
  if (loadError || batchError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Error: {loadError || batchError}</p>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleManualRetry} className="w-40">
            Retry
          </Button>
          <Button
            onClick={handleBackToBatches}
            variant="outline"
            className="w-40"
          >
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state if the batch doesn't exist
  if (!selectedBatch) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">
          Batch #{batchId} not found. The requested batch may not exist.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleManualRetry} className="w-40">
            Retry
          </Button>
          <Button
            onClick={handleBackToBatches}
            variant="outline"
            className="w-40"
          >
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  // Get batch details from either batch report or selected batch
  const batchDetails = batchReport?.batch_details || selectedBatch;

  // Initialize stats with safe defaults in case temperature history is missing
  const stats = temperatureHistory?.length
    ? getBreachStatistics(temperatureHistory)
    : {
        breachCount: 0,
        breachPercentage: 0,
        minTemperature: 0,
        maxTemperature: 0,
        averageTemperature: 0,
      };

  // Get quality information with safe fallbacks
  const qualityInfo = getQualityCategory(
    qualityAssessment?.quality_score || batchDetails.quality_score || 0
  );

  // Determine if batch is active
  const isActive = batchDetails.batch_status === "InTransit";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Batch #{batchId} - {batchDetails.berry_type || "Unknown"}
        </h1>
        <div className="flex space-x-2">
          {isActive && (
            <>
              <Link href={`/temperature/record?batchId=${batchId}`}>
                <Button variant="outline">Record Temperature</Button>
              </Link>
              <Button
                onClick={handleCompleteBatch}
                disabled={completing}
                className="bg-green-600 hover:bg-green-700"
              >
                {completing ? "Completing..." : "Complete Shipment"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Batch Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Current Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs text-white ${
                    batchDetails.batch_status === "InTransit"
                      ? "bg-blue-500"
                      : batchDetails.batch_status === "Delivered"
                      ? "bg-green-500"
                      : batchDetails.batch_status === "Rejected"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  {batchDetails.batch_status || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Start Time:</span>
                <span>{batchDetails.start_time || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">End Time:</span>
                <span>{batchDetails.end_time || "In Progress"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Active:</span>
                <span>{batchDetails.is_active ? "Yes" : "No"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <QualityIndicator
                score={
                  qualityAssessment?.quality_score ||
                  batchDetails.quality_score ||
                  0
                }
                category={qualityInfo.category}
                color={qualityInfo.color}
              />
              <div className="flex justify-between">
                <span className="font-medium">Shelf Life:</span>
                <span>
                  {qualityAssessment?.shelf_life_hours ||
                    batchDetails.predicted_shelf_life_hours ||
                    "N/A"}{" "}
                  hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recommended Action:</span>
                <span
                  className={`text-${getActionColor(
                    qualityAssessment?.recommended_action
                  )}-600 font-medium`}
                >
                  {qualityAssessment?.recommended_action || "No Action"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Readings:</span>
                <span>
                  {stats.breachCount} / {temperatureHistory?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Breach %:</span>
                <span
                  className={`font-medium ${
                    stats.breachPercentage > 20
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {stats.breachPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Min Temp:</span>
                <span>{stats.minTemperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Max Temp:</span>
                <span>{stats.maxTemperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Avg Temp:</span>
                <span>{stats.averageTemperature.toFixed(1)}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Temperature History</CardTitle>
        </CardHeader>
        <CardContent>
          {temperatureHistory && temperatureHistory.length > 0 ? (
            <div className="h-80">
              <TemperatureChart data={temperatureHistory} />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No temperature data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actions & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {qualityAssessment?.action_description ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                {qualityAssessment.action_description}
              </p>
              {isActive && (
                <div className="flex flex-wrap gap-2">
                  <Link href={`/temperature/record?batchId=${batchId}`}>
                    <Button variant="outline" size="sm">
                      Record Temperature
                    </Button>
                  </Link>
                  <Button onClick={handleCompleteBatch} size="sm">
                    Complete Shipment
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recommendations available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchDetailView;
