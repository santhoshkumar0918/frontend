import { loadAndStartAgent } from "./agentLoader";

/**
 * Initializes the entire application, connecting to backend services and setting up integrations
 */
export async function initializeApplication() {
  console.log("Initializing application...");

  try {
    // First, try to connect to the agent server
    const agentResult = await loadAndStartAgent();

    // Log status but continue even if agent fails
    if (!agentResult.success) {
      console.warn("⚠️ Agent initialization failed:", agentResult.message);
      console.warn(
        "Application will continue, but some features may be limited"
      );
    } else {
      console.log("✅ Agent initialized successfully");
    }

    // Return overall status
    return {
      success: true,
      agentStatus: agentResult,
      message: "Application initialized",
    };
  } catch (error) {
    console.error("Application initialization failed:", error);
    return {
      success: false,
      message: "Failed to initialize application",
    };
  }
}
