import * as endpoints from "./endpoints";

// Types that will need to be defined properly in types/api.ts and others
interface Batch {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  currentTemperature?: number;
  optimalTempMin: number;
  optimalTempMax: number;
  qualityScore?: number;
  shelfLifePrediction?: string;
  recommendations?: string[];
  // Add other batch properties as needed
}

interface TemperatureReading {
  batchId: string;
  temperature: number;
  timestamp: string;
  isBreached: boolean;
  location: string;
}

interface QualityAssessment {
  batchId: string;
  qualityScore: number;
  shelfLifePrediction: string;
  recommendations: string[];
  lastUpdated: string;
}

interface SystemHealth {
  status: string;
  agentStatus: string;
  connectionStatus: Record<string, string>;
  lastSyncTimestamp: string;
  pendingTransactions: number;
  systemLoad: number;
}

class BerrySupplyChainClient {
  // General methods
  async getServerStatus(): Promise<{
    status: string;
    agent: string | null;
    agent_running: boolean;
  }> {
    const response = await fetch(endpoints.getServerStatusUrl);
    return this.handleResponse(response);
  }

  async listAgents(): Promise<{ agents: string[] }> {
    const response = await fetch(endpoints.listAgentsUrl);
    return this.handleResponse(response);
  }

  async loadAgent(
    agentName: string
  ): Promise<{ status: string; agent: string }> {
    const url = endpoints.loadAgentUrl.replace("%agentName%", agentName);
    const response = await fetch(url, { method: "POST" });
    return this.handleResponse(response);
  }

  async listConnections(): Promise<{
    connections: Record<
      string,
      { configured: boolean; is_llm_provider: boolean }
    >;
  }> {
    const response = await fetch(endpoints.listConnectionsUrl);
    return this.handleResponse(response);
  }

  async listConnectionActions(
    connectionName: string
  ): Promise<{ connection: string; actions: Record<string, any> }> {
    const url = endpoints.listConnectionActionsUrl.replace(
      "%connectionName%",
      connectionName
    );
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  // Berry temperature monitoring methods
  async monitorTemperature(
    batchId: string,
    temperature: number,
    location: string
  ): Promise<any> {
    const response = await fetch(endpoints.monitorTemperatureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "monitor-berry-temperature",
        params: {
          batch_id: parseInt(batchId),
          temperature,
          location,
        },
      }),
    });
    return this.handleResponse(response);
  }

  async manageBerryQuality(batchId: string): Promise<any> {
    const response = await fetch(endpoints.manageBerryQualityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-berry-quality",
        params: {
          batch_id: parseInt(batchId),
        },
      }),
    });
    return this.handleResponse(response);
  }

  async processRecommendations(batchId: string): Promise<any> {
    const response = await fetch(endpoints.processRecommendationsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "process-agent-recommendations",
        params: {
          batch_id: parseInt(batchId),
        },
      }),
    });
    return this.handleResponse(response);
  }

  // Batch management methods
  async createBatch(berryType: string): Promise<any> {
    const response = await fetch(endpoints.createBatchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-lifecycle",
        params: {
          action: "create",
          berry_type: berryType,
        },
      }),
    });
    return this.handleResponse(response);
  }

  async getBatchStatus(batchId: string): Promise<any> {
    const response = await fetch(endpoints.getBatchStatusUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-lifecycle",
        params: {
          action: "status",
          batch_id: parseInt(batchId),
        },
      }),
    });
    return this.handleResponse(response);
  }

  async getBatchReport(batchId: string): Promise<any> {
    const response = await fetch(endpoints.getBatchReportUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-lifecycle",
        params: {
          action: "report",
          batch_id: parseInt(batchId),
        },
      }),
    });
    return this.handleResponse(response);
  }

  async completeBatch(batchId: string): Promise<any> {
    const response = await fetch(endpoints.completeBatchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-lifecycle",
        params: {
          action: "complete",
          batch_id: parseInt(batchId),
        },
      }),
    });
    return this.handleResponse(response);
  }

  async manageBatchSequence(
    berryType: string,
    temperatures: number[],
    locations: string[],
    completeShipment: boolean
  ): Promise<any> {
    const response = await fetch(endpoints.batchSequenceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-sequence",
        params: {
          berry_type: berryType,
          temperatures,
          locations,
          complete_shipment: completeShipment,
        },
      }),
    });
    return this.handleResponse(response);
  }

  // System health method
  async getSystemHealth(resetCounters: boolean = false): Promise<any> {
    const response = await fetch(endpoints.healthCheckUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "system-health-check",
        params: {
          reset_counters: resetCounters,
        },
      }),
    });
    return this.handleResponse(response);
  }

  // Agent control methods
  async startAgent(): Promise<{ status: string; message: string }> {
    const response = await fetch(endpoints.startAgentUrl, {
      method: "POST",
    });
    return this.handleResponse(response);
  }

  async stopAgent(): Promise<{ status: string; message: string }> {
    const response = await fetch(endpoints.stopAgentUrl, {
      method: "POST",
    });
    return this.handleResponse(response);
  }

  // Helper methods
  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail ||
          `API request failed: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }

  // Utility methods
  async getAllBatches(): Promise<any[]> {
    const response = await fetch(endpoints.getBatchStatusUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "sonic",
        action: "manage-batch-lifecycle",
        params: {
          action: "list",
        },
      }),
    });
    return this.handleResponse(response);
  }

  async getTemperatureHistory(batchId: string): Promise<any[]> {
    const batchReport = await this.getBatchReport(batchId);
    return batchReport.result?.report?.temperature_history || [];
  }

  async getQualityAssessment(batchId: string): Promise<any> {
    return this.manageBerryQuality(batchId);
  }
}

export default BerrySupplyChainClient;
