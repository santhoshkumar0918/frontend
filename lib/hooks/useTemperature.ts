import { useState, useCallback } from "react";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";

interface TemperatureReading {
  timestamp: string | number;
  temperature: number;
  location: string;
  isBreached: boolean;
}

export function useTemperature() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<
    TemperatureReading[]
  >([]);

  const client = new BerrySupplyChainClient();

  const recordTemperature = useCallback(
    async (batchId: string, temperature: number, location: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await client.monitorTemperature(
          batchId,
          temperature,
          location
        );

        if (response.result?.status === "completed") {
          return response.result;
        } else {
          throw new Error(
            response.result?.error || "Failed to record temperature"
          );
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while recording temperature"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTemperatureHistory = useCallback(async (batchId: string) => {
    setLoading(true);
    setError(null);

    try {
      // We'll get the temperature history from the batch report
      const batchReport = await client.getBatchReport(batchId);

      if (batchReport.result?.status === "completed") {
        const history = batchReport.result?.temperature_stats?.readings || [];
        setTemperatureHistory(history);
        return history;
      } else {
        throw new Error(
          batchReport.result?.error || "Failed to fetch temperature history"
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          `An error occurred while fetching temperature history for batch ${batchId}`
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getBreachStatistics = useCallback((history: TemperatureReading[]) => {
    if (!history || history.length === 0) {
      return {
        breachCount: 0,
        breachPercentage: 0,
        maxTemperature: 0,
        minTemperature: 0,
        averageTemperature: 0,
      };
    }

    const breachCount = history.filter((reading) => reading.isBreached).length;
    const breachPercentage = (breachCount / history.length) * 100;
    const temperatures = history.map((reading) => reading.temperature);
    const maxTemperature = Math.max(...temperatures);
    const minTemperature = Math.min(...temperatures);
    const averageTemperature =
      temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    return {
      breachCount,
      breachPercentage,
      maxTemperature,
      minTemperature,
      averageTemperature: parseFloat(averageTemperature.toFixed(1)),
    };
  }, []);

  return {
    loading,
    error,
    temperatureHistory,
    recordTemperature,
    fetchTemperatureHistory,
    getBreachStatistics,
  };
}
