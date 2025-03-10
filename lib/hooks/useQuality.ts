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
  success?: boolean;
  error?: string;
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
      console.log(`Assessing quality for batch ${batchId}...`);
      const response = await client.manageBerryQuality(batchId);
      console.log("Quality assessment response:", response);

      if (!response) {
        throw new Error("No response received from quality assessment");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.result) {
        if (response.result.status && response.result.status !== "completed") {
          throw new Error(
            response.result.error || "Quality assessment not completed"
          );
        }

        setQualityAssessment(response.result);
        return response.result;
      }

      if (response.success === true) {
        setQualityAssessment(response);
        return response;
      }

      throw new Error("Failed to assess quality: Unexpected response format");
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
      console.log(`Processing recommendations for batch ${batchId}...`);
      const response = await client.processRecommendations(batchId);
      console.log("Process recommendations response:", response);

      if (!response) {
        throw new Error("No response received from recommendations process");
      }
      if (response.error) {
        throw new Error(response.error);
      }

      // Check if response has a result property
      if (response.result) {
        // Check if result has a status field and it's not completed
        if (response.result.status && response.result.status !== "completed") {
          throw new Error(
            response.result.error || "Failed to process recommendations"
          );
        }
        return response.result;
      }

      // If the response itself is the result (has success field)
      if (response.success === true) {
        return response;
      }

      // If no clear result structure, throw an error
      throw new Error(
        "Failed to process recommendations: Unexpected response format"
      );
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
    if (score === undefined || score === null)
      return { category: "Unknown", color: "gray" };

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
