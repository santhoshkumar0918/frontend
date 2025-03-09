import BerrySupplyChainClient from "../api/berrySupplyChainClient";
// Default agent name - you might want to change this to match your specific agent
const DEFAULT_AGENT = "berry-agent";

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

    // 2. List available agents
    const agentsResponse = await client.listAgents();
    const availableAgents = agentsResponse.agents || [];
    console.log("Available agents:", availableAgents);

    if (availableAgents.length === 0) {
      return { success: false, message: "No agents available on the server" };
    }

    // 3. Determine which agent to load (use default or first available)
    const agentToLoad = availableAgents.includes(DEFAULT_AGENT)
      ? DEFAULT_AGENT
      : availableAgents[0];

    // 4. Check if agent is already loaded and running
    if (serverStatus.agent === agentToLoad && serverStatus.agent_running) {
      return {
        success: true,
        message: `Agent ${agentToLoad} is already running`,
      };
    }

    // 5. Load the agent if needed
    if (serverStatus.agent !== agentToLoad) {
      const loadResponse = await client.loadAgent(agentToLoad);
      console.log("Agent load response:", loadResponse);
    }

    // 6. Start the agent
    const startResponse = await client.startAgent();
    console.log("Agent start response:", startResponse);

    // 7. List connections to make sure everything is properly set up
    const connectionsResponse = await client.listConnections();
    console.log("Connections:", connectionsResponse);

    return {
      success: true,
      message: `Agent ${agentToLoad} loaded and started successfully`,
      agent: agentToLoad,
      connections: connectionsResponse.connections,
    };
  } catch (error) {
    console.error("Error loading agent:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error loading agent",
    };
  }
}
