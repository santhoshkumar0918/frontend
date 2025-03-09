import { useState, useCallback } from "react";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";

interface QualityAssessment {
  batch_id?: string | number;
  berry_type?: string;
  quality_score?: number;
  shelf_life_hours?: number;
  temperature_readings?: number;
  breach_count?: number;
  breach_percentage?: number;
  recommended_action?: string;
  action_description?: string;
  timestamp?: string;
}

export function useQuality() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityAssessment, setQualityAssessment] =
    useState<QualityAssessment | null>(null);

  const client = new BerrySupplyChainClient();

  const assessQuality = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.manageBerryQuality(batchId);

      if (response && response.result?.status === "completed") {
        setQualityAssessment(response.result);
        return response.result;
      } else {
        const errorMessage =
          response?.result?.error || "Failed to assess quality";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        `An error occurred while assessing quality for batch ${batchId}`;
      setError(errorMessage);
      console.error("Quality assessment error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processRecommendations = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.processRecommendations(batchId);

      if (response && response.result?.status === "completed") {
        return response.result;
      } else {
        const errorMessage =
          response?.result?.error || "Failed to process recommendations";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        `An error occurred while processing recommendations for batch ${batchId}`;
      setError(errorMessage);
      console.error("Process recommendations error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActionColor = useCallback((action: string | undefined) => {
    const actionMap: Record<string, string> = {
      "No Action": "green",
      Alert: "blue",
      Expedite: "orange",
      Reroute: "yellow",
      Reject: "red",
    };

    return actionMap[action || ""] || "gray";
  }, []);

  const getQualityCategory = useCallback((score: number | undefined) => {
    if (!score && score !== 0) return { category: "Unknown", color: "gray" };

    if (score >= 90) return { category: "Excellent", color: "green" };
    if (score >= 80) return { category: "Good", color: "teal" };
    if (score >= 70) return { category: "Fair", color: "yellow" };
    if (score >= 60) return { category: "Poor", color: "orange" };
    return { category: "Critical", color: "red" };
  }, []);

  return {
    loading,
    error,
    qualityAssessment,
    assessQuality,
    processRecommendations,
    getActionColor,
    getQualityCategory,
  };
}
