import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
// import { Input } from "../ui/input";
import { useBatch } from "../../lib/hooks/useBatch";

const CreateBatchForm: React.FC = () => {
  const router = useRouter();
  const { createBatch, loading, error } = useBatch();
  const [berryType, setBerryType] = useState<string>("Strawberry");
  const [formError, setFormError] = useState<string | null>(null);

  const berryTypes = ["Strawberry", "Blueberry", "Raspberry", "Blackberry"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!berryType) {
      setFormError("Please select a berry type");
      return;
    }

    try {
      const result = await createBatch(berryType);
      if (result) {
        // Navigate to the new batch's page
        router.push(`/batches/${result.batch_id}`);
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to create batch");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
        <CardDescription>
          Start a new berry shipment by creating a batch. You'll be able to
          track temperature, quality, and other metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="berryType" className="block text-sm font-medium">
              Berry Type
            </label>
            <select
              id="berryType"
              value={berryType}
              onChange={(e) => setBerryType(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading}
            >
              {berryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="tempRange" className="block text-sm font-medium">
              Optimal Temperature Range
            </label>
            <div className="text-sm text-gray-500">
              0°C - 4°C (Non-configurable for safety reasons)
            </div>
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
          onClick={() => router.push("/batches")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Batch"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateBatchForm;
