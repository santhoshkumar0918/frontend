import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTemperature } from "../../lib/hooks/useTemperature";
import { useBatch } from "../../lib/hooks/useBatch";

const TemperatureForm: React.FC = () => {
  const router = useRouter();
  const { batchId } = router.query;
  const { recordTemperature, loading, error } = useTemperature();
  const { fetchBatchById, selectedBatch } = useBatch();

  const [temperature, setTemperature] = useState<number>(2.0);
  const [location, setLocation] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isBreached, setIsBreached] = useState<boolean>(false);

  const locations = [
    "Cold Storage",
    "Loading Dock",
    "Transport",
    "Distribution Center",
    "Retail",
  ];

  useEffect(() => {
    if (batchId && typeof batchId === "string") {
      fetchBatchById(batchId);
    }
  }, [batchId, fetchBatchById]);

  useEffect(() => {
    // Check if temperature is outside the optimal range
    if (temperature < 0 || temperature > 4) {
      setIsBreached(true);
    } else {
      setIsBreached(false);
    }
  }, [temperature]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!batchId) {
      setFormError("Batch ID is required");
      return;
    }

    if (!location) {
      setFormError("Please select a location");
      return;
    }

    try {
      const result = await recordTemperature(
        batchId as string,
        temperature,
        location
      );
      if (result) {
        // Navigate back to the batch detail page
        router.push(`/batches/${batchId}`);
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to record temperature");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Record Temperature</CardTitle>
        <CardDescription>
          {selectedBatch ? (
            <>
              Recording temperature for Batch #{batchId} -{" "}
              {selectedBatch.berry_type}
            </>
          ) : (
            <>Recording temperature for Batch #{batchId}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="temperature" className="block text-sm font-medium">
              Temperature (°C)
            </label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              min="-10"
              max="40"
              className={`w-full ${isBreached ? "border-red-500" : ""}`}
              disabled={loading}
            />
            {isBreached && (
              <p className="text-sm text-red-500">
                Warning: Temperature is outside the optimal range (0°C - 4°C)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading}
            >
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {(error || formError) && (
            <div className="text-red-500 text-sm">{error || formError}</div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/batches/${batchId}`)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={isBreached ? "bg-yellow-500 hover:bg-yellow-600" : ""}
        >
          {loading
            ? "Recording..."
            : isBreached
            ? "Record with Warning"
            : "Record Temperature"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemperatureForm;
