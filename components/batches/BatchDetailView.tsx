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

const statusColors = {
  InTransit: "bg-blue-500",
  Delivered: "bg-green-500",
  Rejected: "bg-red-500",
  default: "bg-gray-500",
};

const BatchDetailView: React.FC<BatchDetailViewProps> = ({ batchId }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Batch Hook
  const {
    loading: batchLoading,
    error: batchError,
    fetchBatchById,
    fetchBatchReport,
    selectedBatch,
    batchReport,
    completeBatch,
  } = useBatch();

  // Temperature Hook
  const {
    loading: temperatureLoading,
    error: temperatureError,
    fetchTemperatureHistory,
    temperatureHistory,
    getBreachStatistics,
  } = useTemperature();

  // Quality Hook
  const {
    loading: qualityLoading,
    error: qualityError,
    assessQuality,
    qualityAssessment,
    getQualityCategory,
    getActionColor,
  } = useQuality();

  const [completing, setCompleting] = useState(false);
  const isLoading = batchLoading || temperatureLoading || qualityLoading;
  const error = batchError || temperatureError || qualityError;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadData = async () => {
      try {
        await Promise.all([
          fetchBatchById(batchId),
          fetchBatchReport(batchId),
          fetchTemperatureHistory(batchId),
          assessQuality(batchId),
        ]);
      } catch (err) {
        console.error("Batch load error:", err);
      }
    };

    loadData();
  }, [batchId, isMounted]);

  const handleCompleteBatch = async () => {
    if (!window.confirm("Complete shipment?")) return;

    setCompleting(true);
    try {
      await completeBatch(batchId);
      router.refresh();
      router.push("/batches");
    } finally {
      setCompleting(false);
    }
  };

  if (!isMounted || isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const batchDetails = batchReport?.batch_details ?? selectedBatch ?? {};
  const stats = getBreachStatistics(temperatureHistory);
  const qualityScore =
    qualityAssessment?.quality_score ?? batchDetails.quality_score ?? 0;
  const qualityInfo = getQualityCategory(qualityScore);
  const isActive = batchDetails.batch_status === "InTransit";

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {batchDetails.berry_type} - Batch #{batchId}
        </h1>
        {isActive && (
          <div className="flex gap-2">
            <Link href={`/temperature/record?batchId=${batchId}`}>
              <Button variant="outline">Record Temperature</Button>
            </Link>
            <Button
              onClick={handleCompleteBatch}
              disabled={completing}
              className="bg-green-600 hover:bg-green-700"
            >
              {completing ? "Processing..." : "Complete Shipment"}
            </Button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard batchDetails={batchDetails} />
        <QualityCard
          qualityAssessment={qualityAssessment}
          batchDetails={batchDetails}
          qualityInfo={qualityInfo}
          getActionColor={getActionColor}
        />
        <TemperatureStatsCard
          stats={stats}
          temperatureHistory={temperatureHistory}
        />
      </div>

      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature History</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <TemperatureChart data={temperatureHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

// Sub-components for better readability
const StatusCard = ({ batchDetails }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Status</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <StatusItem label="Current Status" value={batchDetails.batch_status} />
      <StatusItem label="Start Time" value={batchDetails.start_time} />
      <StatusItem label="End Time" value={batchDetails.end_time} />
      <StatusItem
        label="Active"
        value={batchDetails.is_active ? "Yes" : "No"}
      />
    </CardContent>
  </Card>
);

const StatusItem = ({ label, value }: any) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span>{value || "N/A"}</span>
  </div>
);

const QualityCard = ({
  qualityAssessment,
  batchDetails,
  qualityInfo,
  getActionColor,
}: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Quality Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <QualityIndicator
        score={qualityInfo.score}
        category={qualityInfo.category}
        color={qualityInfo.color}
      />
      <StatusItem
        label="Shelf Life"
        value={`${
          qualityAssessment?.shelf_life_hours ||
          batchDetails.predicted_shelf_life_hours ||
          "N/A"
        } hours`}
      />
      <StatusItem
        label="Recommended Action"
        value={qualityAssessment?.recommended_action}
        colorClass={getActionColor(qualityAssessment?.recommended_action)}
      />
    </CardContent>
  </Card>
);

const TemperatureStatsCard = ({ stats, temperatureHistory }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Temperature Stats</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <StatusItem
        label="Readings"
        value={`${stats.breachCount}/${temperatureHistory.length}`}
      />
      <StatusItem
        label="Breach %"
        value={`${stats.breachPercentage.toFixed(1)}%`}
      />
      <StatusItem
        label="Min Temp"
        value={`${stats.minTemperature.toFixed(1)}°C`}
      />
      <StatusItem
        label="Max Temp"
        value={`${stats.maxTemperature.toFixed(1)}°C`}
      />
      <StatusItem
        label="Avg Temp"
        value={`${stats.averageTemperature.toFixed(1)}°C`}
      />
    </CardContent>
  </Card>
);

export default BatchDetailView;
