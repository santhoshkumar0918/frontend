import { useState, useCallback } from "react";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";

interface BatchDetails {
  batch_id?: string | number;
  berry_type?: string;
  batch_status?: string;
  quality_score?: number;
  predicted_shelf_life_hours?: number;
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
}

interface BatchReport {
  batch_details?: BatchDetails;
  temperature_stats?: {
    reading_count?: number;
    breach_count?: number;
    breach_percentage?: string;
    max_temperature?: number;
    min_temperature?: number;
    readings?: any[];
  };
  predictions?: any[];
}

export function useBatch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);
  const [batchReport, setBatchReport] = useState<BatchReport | null>(null);

  const client = new BerrySupplyChainClient();

  const createBatch = useCallback(async (berryType: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Creating batch with berry type: ${berryType}`);
      const response = await client.createBatch(berryType);
      console.log("Create batch API response:", response);

      // The response structure might be different from what you expect
      // Let's handle various possible response formats

      // If there's a direct success flag
      if (response.success === true) {
        return response;
      }

      // If there's a result object with status
      if (response.result?.status === "completed") {
        return response.result;
      }

      // If there's a direct batch_id in the response
      if (response.batch_id !== undefined) {
        return response;
      }

      // If there's a result with a batch_id
      if (response.result?.batch_id !== undefined) {
        return response.result;
      }

      // Check for errors
      if (response.error || response.result?.error) {
        throw new Error(response.error || response.result?.error);
      }

      console.warn("Unexpected response format:", response);
      return response;
    } catch (err: any) {
      console.error("Error creating batch:", err);
      setError(err.message || "An error occurred while creating the batch");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, this is a workaround since there's no direct endpoint for listing all batches
      // We'll fake it by getting batch reports for the last 10 batches (assuming IDs 0-9)
      const batchData = [];

      for (let i = 0; i < 10; i++) {
        try {
          const response = await client.getBatchStatus(i.toString());
          if (response.result?.status === "completed") {
            batchData.push(response.result);
          }
        } catch (err) {
          // Ignore errors for individual batches
        }
      }

      setBatches(batchData);
      return batchData;
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching batches");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBatchById = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.getBatchStatus(batchId);

      if (response.result?.status === "completed") {
        setSelectedBatch(response.result);
        return response.result;
      } else {
        throw new Error(response.result?.error || "Failed to fetch batch");
      }
    } catch (err: any) {
      setError(
        err.message || `An error occurred while fetching batch ${batchId}`
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBatchReport = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.getBatchReport(batchId);

      if (response.result?.status === "completed") {
        setBatchReport(response.result);
        return response.result;
      } else {
        throw new Error(
          response.result?.error || "Failed to fetch batch report"
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          `An error occurred while fetching batch report for ${batchId}`
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeBatch = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.completeBatch(batchId);

      if (
        response.result?.status === "completed" ||
        response.result?.status === "redirected"
      ) {
        return response.result;
      } else {
        throw new Error(response.result?.error || "Failed to complete batch");
      }
    } catch (err: any) {
      setError(
        err.message || `An error occurred while completing batch ${batchId}`
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    batches,
    selectedBatch,
    batchReport,
    createBatch,
    fetchBatches,
    fetchBatchById,
    fetchBatchReport,
    completeBatch,
  };
}
