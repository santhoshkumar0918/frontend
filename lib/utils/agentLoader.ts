"use client";

import BerrySupplyChainClient from "../api/berrySupplyChainClient";

// Default agent name - this should match what the server is using
const DEFAULT_AGENT = "example";

/**
 * Loads the agent system and ensures it's running
 * @returns Promise with status information
 */
export async function loadAndStartAgent() {
  try {
    const client = new BerrySupplyChainClient();

    // 1. Check server status
    const serverStatus = await client.getServerStatus();
    console.log("Server status:", serverStatus);

    // If agent is already running, return success
    if (serverStatus.agent_running) {
      return {
        success: true,
        message: `Agent ${serverStatus.agent} is already running`,
        agent: serverStatus.agent,
      };
    }

    // 2. List available agents
    const agentsResponse = await client.listAgents();
    const availableAgents = agentsResponse.agents || [];
    console.log("Available agents:", availableAgents);

    if (availableAgents.length === 0) {
      return { success: false, message: "No agents available on the server" };
    }

    // 3. Determine which agent to load - use "example" since that's what your server is using
    // Look for BerryMonitorAgent but fall back to example
    const agentToLoad = availableAgents.includes("example")
      ? "example"
      : availableAgents[0];

    // 4. Load the agent if needed
    if (serverStatus.agent !== agentToLoad) {
      const loadResponse = await client.loadAgent(agentToLoad);
      console.log("Agent load response:", loadResponse);
    }

    // 5. Start the agent
    try {
      const startResponse = await client.startAgent();
      console.log("Agent start response:", startResponse);
    } catch (err: any) {
      // If agent is already running, this is actually fine
      if (err.message && err.message.includes("Agent already running")) {
        console.log("Agent is already running, continuing");
      } else {
        throw err;
      }
    }

    // 6. List connections to make sure everything is properly set up
    const connectionsResponse = await client.listConnections();
    console.log("Connections:", connectionsResponse);

    return {
      success: true,
      message: `Agent ${agentToLoad} loaded and started successfully`,
      agent: agentToLoad,
      connections: connectionsResponse.connections,
    };
  } catch (error: any) {
    console.error("Error loading agent:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error loading agent",
    };
  }
}

/**
 * Initializes the agent system on application startup
 */
export async function initializeAgentSystem() {
  try {
    console.log("Initializing agent system...");
    const result = await loadAndStartAgent();
    return result;
  } catch (error) {
    console.error("Failed to initialize agent system:", error);
    return {
      success: false,
      message: "Failed to initialize agent system. Check server connection.",
    };
  }
}
