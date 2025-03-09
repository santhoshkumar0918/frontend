import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation
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
  // Always call hooks at the top level, not conditionally
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadBatchData = async () => {
      await fetchBatchById(batchId);
      await fetchBatchReport(batchId);
      await fetchTemperatureHistory(batchId);
      await assessQuality(batchId);
    };

    loadBatchData();
  }, [
    batchId,
    fetchBatchById,
    fetchBatchReport,
    fetchTemperatureHistory,
    assessQuality,
    isMounted,
  ]);

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

  // Show loading state if component is still mounting or data is loading
  if (!isMounted || batchLoading) {
    return <div className="text-center py-10">Loading batch details...</div>;
  }

  if (batchError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error: {batchError}</p>
        <Button onClick={() => fetchBatchById(batchId)} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!selectedBatch) {
    return <div className="text-center py-10">Batch not found</div>;
  }

  const batchDetails = batchReport?.batch_details || selectedBatch;
  const stats = getBreachStatistics(temperatureHistory);
  const qualityInfo = getQualityCategory(
    qualityAssessment?.quality_score || batchDetails.quality_score
  );
  const isActive = batchDetails.batch_status === "InTransit";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Batch #{batchId} - {batchDetails.berry_type}
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
                  className={`px-3 py-1 rounded-full text-xs text-white bg-${
                    batchDetails.batch_status === "InTransit"
                      ? "blue"
                      : batchDetails.batch_status === "Delivered"
                      ? "green"
                      : batchDetails.batch_status === "Rejected"
                      ? "red"
                      : "gray"
                  }-500`}
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
                  {stats.breachCount} / {temperatureHistory.length}
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
          {temperatureHistory.length > 0 ? (
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
                  <Link href={`/batches/${batchId}/complete`}>
                    <Button size="sm">Complete Shipment</Button>
                  </Link>
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
