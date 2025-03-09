import dynamic from "next/dynamic";

// Import components with no SSR to avoid router issues
const CreateBatchForm = dynamic(() => import("./CreateBatchForm"), {
  ssr: false,
});

const BatchDetailView = dynamic(() => import("./BatchDetailView"), {
  ssr: false,
});

const BatchList = dynamic(() => import("./BatchList"), { ssr: false });

// Export all components
export { CreateBatchForm, BatchDetailView, BatchList };

// Export CreateBatchForm as default for backward compatibility
export default CreateBatchForm;
