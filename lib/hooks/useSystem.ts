import { useState, useCallback, useEffect } from "react";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";

interface SystemHealthMetrics {
  timestamp?: string;
  is_connected?: boolean;
  contract_accessible?: boolean;
  account_balance?: string;
  transaction_count?: number;
  successful_transactions?: number;
  failed_transactions?: number;
  transaction_success_rate?: string;
  temperature_breaches?: number;
  critical_breaches?: number;
  warning_breaches?: number;
  batches_created?: number;
  batches_completed?: number;
}

export function useSystem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [healthMetrics, setHealthMetrics] =
    useState<SystemHealthMetrics | null>(null);
  const [agentStatus, setAgentStatus] = useState<{
    running: boolean;
    name: string | null;
  }>({
    running: false,
    name: null,
  });

  const client = new BerrySupplyChainClient();

  const fetchHealthMetrics = useCallback(
    async (resetCounters: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await client.getSystemHealth(resetCounters);

        if (response.result?.status === "completed") {
          setHealthMetrics(response.result.health_report);
          return response.result.health_report;
        } else {
          throw new Error(
            response.result?.error || "Failed to fetch system health metrics"
          );
        }
      } catch (err: any) {
        setError(
          err.message ||
            "An error occurred while fetching system health metrics"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAgentStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.getServerStatus();

      setAgentStatus({
        running: response.agent_running,
        name: response.agent,
      });

      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching agent status");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startAgent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.startAgent();

      if (response.status === "success") {
        // Refresh agent status
        await fetchAgentStatus();
        return true;
      } else {
        throw new Error(response.message || "Failed to start agent");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while starting agent");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAgentStatus]);

  const stopAgent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.stopAgent();

      if (response.status === "success") {
        // Refresh agent status
        await fetchAgentStatus();
        return true;
      } else {
        throw new Error(response.message || "Failed to stop agent");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while stopping agent");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAgentStatus]);

  // Initialize by fetching agent status
  useEffect(() => {
    fetchAgentStatus();
  }, [fetchAgentStatus]);

  return {
    loading,
    error,
    healthMetrics,
    agentStatus,
    fetchHealthMetrics,
    fetchAgentStatus,
    startAgent,
    stopAgent,
  };
}
