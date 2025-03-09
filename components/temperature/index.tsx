import dynamic from "next/dynamic";

// Import TemperatureForm with no SSR to avoid router issues
const TemperatureForm = dynamic(() => import("./TemperatureForm"), {
  ssr: false,
});

// Re-export existing components
export { default as TemperatureChart } from "./TemperatureChart";
export { default as TemperatureTable } from "./TemperatureTable";
export { TemperatureForm };

// Export the TemperatureForm as default export
export default TemperatureForm;
