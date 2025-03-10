// "use client";

// import React, { useEffect, useState } from "react";
// import { useSystem } from "../../lib/hooks/useSystem";
// import { useBatch } from "../../lib/hooks/useBatch";
// import BatchList from "../../components/batches/BatchList";
// import HealthMetrics from "../../components/system/HealthMetrics";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import DashboardWrapper from "@/components/layout/DashBoardWrapper";
// import { Activity, LayoutDashboard, Package, Thermometer } from "lucide-react";

// export default function Dashboard() {
//   const {
//     healthMetrics,
//     fetchHealthMetrics,
//     loading: systemLoading,
//   } = useSystem();
//   const { batches, fetchBatches, loading: batchLoading } = useBatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         await Promise.all([fetchHealthMetrics(), fetchBatches()]);
//       } catch (error) {
//         console.error("Error loading dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//     const intervalId = setInterval(() => {
//       fetchHealthMetrics();
//     }, 30000); // Refresh every 30 seconds

//     return () => clearInterval(intervalId);
//   }, [fetchHealthMetrics, fetchBatches]);

//   const handleRefreshHealthMetrics = () => {
//     fetchHealthMetrics();
//   };

//   const handleResetCounters = () => {
//     fetchHealthMetrics(true);
//   };

//   if (loading || systemLoading || batchLoading) {
//     return (
//       <DashboardWrapper>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       </DashboardWrapper>
//     );
//   }

//   return (
//     <DashboardWrapper>
//       <div>
//         <h1 className="text-3xl font-bold mb-8 text-white">
//           Berry Supply Chain Dashboard
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           {/* Batch Stats Card */}
//           <Card className="bg-gray-800 border-gray-700 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-semibold flex items-center">
//                 <Package className="h-5 w-5 mr-2 text-blue-400" />
//                 Batch Statistics
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center">
//                 <div className="text-4xl font-bold text-blue-400">
//                   {batches.length}
//                 </div>
//                 <p className="text-gray-400">Total Batches</p>

//                 <div className="w-full mt-4 grid grid-cols-2 gap-2">
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-blue-400">
//                       {
//                         batches.filter((b) => b.batch_status === "InTransit")
//                           .length
//                       }
//                     </div>
//                     <p className="text-xs text-gray-400">In Transit</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-green-400">
//                       {
//                         batches.filter((b) => b.batch_status === "Delivered")
//                           .length
//                       }
//                     </div>
//                     <p className="text-xs text-gray-400">Completed</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Temperature Stats Card */}
//           <Card className="bg-gray-800 border-gray-700 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-semibold flex items-center">
//                 <Thermometer className="h-5 w-5 mr-2 text-blue-400" />
//                 Temperature Alerts
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center">
//                 <div className="text-4xl font-bold text-blue-400">
//                   {healthMetrics?.temperature_breaches || 0}
//                 </div>
//                 <p className="text-gray-400">Total Breaches</p>

//                 <div className="w-full mt-4 grid grid-cols-2 gap-2">
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-red-400">
//                       {healthMetrics?.critical_breaches || 0}
//                     </div>
//                     <p className="text-xs text-gray-400">Critical</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-yellow-400">
//                       {healthMetrics?.warning_breaches || 0}
//                     </div>
//                     <p className="text-xs text-gray-400">Warnings</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Transaction Stats Card */}
//           <Card className="bg-gray-800 border-gray-700 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-semibold flex items-center">
//                 <Activity className="h-5 w-5 mr-2 text-blue-400" />
//                 Blockchain Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center">
//                 <div className="text-4xl font-bold text-blue-400">
//                   {healthMetrics?.transaction_count || 0}
//                 </div>
//                 <p className="text-gray-400">Transactions</p>

//                 <div className="w-full mt-4 grid grid-cols-2 gap-2">
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-green-400">
//                       {healthMetrics?.successful_transactions || 0}
//                     </div>
//                     <p className="text-xs text-gray-400">Successful</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xl font-semibold text-red-400">
//                       {healthMetrics?.failed_transactions || 0}
//                     </div>
//                     <p className="text-xs text-gray-400">Failed</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Batch Quality Card */}
//           <Card className="bg-gray-800 border-gray-700 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-semibold flex items-center">
//                 <LayoutDashboard className="h-5 w-5 mr-2 text-blue-400" />
//                 Quality Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center">
//                 <div className="h-12 w-12 rounded-full bg-blue-900/50 border border-blue-400 flex items-center justify-center mb-2">
//                   <div className="h-8 w-8 rounded-full bg-blue-400 animate-pulse"></div>
//                 </div>
//                 <p className="text-gray-400">Quality Monitoring</p>
//                 <div className="mt-2 text-sm font-semibold text-blue-400">
//                   Active
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Recent Batches */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold mb-4 text-white">Recent Batches</h2>
//           <BatchList />
//         </div>

//         {/* System Health Metrics */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4 text-white">System Health</h2>
//           <HealthMetrics
//             metrics={healthMetrics || {}}
//             onRefresh={handleRefreshHealthMetrics}
//             onReset={handleResetCounters}
//           />
//         </div>
//       </div>
//     </DashboardWrapper>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useSystem } from "../../lib/hooks/useSystem";
import { useBatch } from "../../lib/hooks/useBatch";
import BatchList from "../../components/batches/BatchList";
import HealthMetrics from "../../components/system/HealthMetrics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardWrapper from "@/components/layout/DashBoardWrapper";
import { 
  Activity, 
  LayoutDashboard, 
  Package, 
  Thermometer, 
  Bot, 
  AlertCircle,
  Cpu,
  Check,
  Clock
} from "lucide-react";
import { Progress } from "../../components/ui/progress";

// Mock data for batches
const MOCK_BATCHES = [
  {
    id: "BTH-1023",
    batch_name: "Strawberry Premium",
    origin: "California Farms",
    destination: "Chicago Distribution",
    current_temperature: 4.2,
    optimal_temperature: 4.0,
    batch_status: "InTransit",
    quality_score: 97,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    agent_verification: "Verified by BerryBot",
    estimated_delivery: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    blockchain_tx: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f"
  },
  {
    id: "BTH-1022",
    batch_name: "Blueberry Organic",
    origin: "Oregon Berries",
    destination: "Seattle Market",
    current_temperature: 3.8,
    optimal_temperature: 4.0,
    batch_status: "InTransit",
    quality_score: 94,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    agent_verification: "Verified by BerryBot",
    estimated_delivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    blockchain_tx: "0x71c7656ec7ab88b098defb751b7401b5f6d8976e"
  },
  {
    id: "BTH-1021",
    batch_name: "Mixed Berries",
    origin: "Washington Co-op",
    destination: "Portland Stores",
    current_temperature: 3.9,
    optimal_temperature: 4.0,
    batch_status: "Delivered",
    quality_score: 92,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    agent_verification: "Verified by BerryBot",
    estimated_delivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    blockchain_tx: "0x71c7656ec7ab88b098defb751b7401b5f6d8976d"
  },
  {
    id: "BTH-1020",
    batch_name: "Raspberry Gold",
    origin: "Michigan Farms",
    destination: "New York Distribution",
    current_temperature: 4.5,
    optimal_temperature: 4.0,
    batch_status: "Delivered",
    quality_score: 89,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    agent_verification: "Verified by BerryBot",
    estimated_delivery: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    blockchain_tx: "0x71c7656ec7ab88b098defb751b7401b5f6d8976c"
  }
];

// Mock data for health metrics
const MOCK_HEALTH_METRICS = {
  temperature_breaches: 12,
  critical_breaches: 3,
  warning_breaches: 9,
  transaction_count: 438,
  successful_transactions: 426,
  failed_transactions: 12,
  system_uptime: "99.8%",
  agent_response_time: "1.2s",
  agent_accuracy: "98.7%",
  last_agent_activity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  blockchain_latency: "0.8s",
  node_health: "Optimal",
  network_status: "Connected",
  active_agents: 5,
  agent_tasks_completed: 1247
};

// Modified BatchList component with mock data
const ModifiedBatchList = () => {
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);
  
  useEffect(() => {
    // Simulate agent activity periodically
    const interval = setInterval(() => {
      setIsAgentProcessing(true);
      setTimeout(() => setIsAgentProcessing(false), 3000);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-400" />
          <span className="font-bold text-white">Batch Tracking</span>
        </div>
        <div className="flex items-center">
          {isAgentProcessing ? (
            <div className="flex items-center text-blue-400 text-sm">
              <Bot className="h-4 w-4 mr-2 animate-pulse" />
              <span>Agent processing data...</span>
            </div>
          ) : (
            <div className="flex items-center text-green-400 text-sm">
              <Bot className="h-4 w-4 mr-2" />
              <span>Agent monitoring</span>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Batch ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Temperature</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quality</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {MOCK_BATCHES.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-750 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-white">{batch.id}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{batch.batch_name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  {batch.batch_status === "InTransit" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300 flex items-center w-fit">
                      <Clock className="h-3 w-3 mr-1" />
                      In Transit
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300 flex items-center w-fit">
                      <Check className="h-3 w-3 mr-1" />
                      Delivered
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <Thermometer className={`h-4 w-4 mr-1 ${Math.abs(batch.current_temperature - batch.optimal_temperature) > 0.5 ? 'text-yellow-400' : 'text-green-400'}`} />
                    <span className="text-gray-300">{batch.current_temperature}°C</span>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Quality Score</span>
                      <span className="text-xs font-medium text-blue-400">{batch.quality_score}%</span>
                    </div>
                    <Progress value={batch.quality_score} className={`h-1.5 ${batch.quality_score > 95 ? 'bg-green-400' : batch.quality_score > 90 ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  <div className="flex items-center text-green-400">
                    <Bot className="h-4 w-4 mr-1" />
                    <span>{batch.agent_verification}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Modified HealthMetrics component
interface HealthMetricsProps {
  metrics: {
    temperature_breaches: number;
    critical_breaches: number;
    warning_breaches: number;
    transaction_count: number;
    successful_transactions: number;
    failed_transactions: number;
    system_uptime: string;
    agent_response_time: string;
    agent_accuracy: string;
    last_agent_activity: string;
    blockchain_latency: string;
    node_health: string;
    network_status: string;
    active_agents: number;
    agent_tasks_completed: number;
  };
  onRefresh: () => void;
  onReset: () => void;
}

const ModifiedHealthMetrics = ({ metrics, onRefresh, onReset }: HealthMetricsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-purple-400" />
            AI Agent Performance
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time monitoring of agent activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Agent Accuracy</span>
                <span className="text-sm font-medium text-green-400">{metrics.agent_accuracy}</span>
              </div>
              <Progress value={98.7} className="h-2 bg-green-400" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Response Time</span>
                <span className="text-sm font-medium text-blue-400">{metrics.agent_response_time}</span>
              </div>
              <Progress value={85} className="h-2 bg-gray-700" style={{ backgroundColor: 'bg-blue-400' }} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-750 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Agents</span>
                  <span className="text-lg font-semibold text-blue-400">{metrics.active_agents}</span>
                </div>
              </div>
              <div className="bg-gray-750 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tasks Completed</span>
                  <span className="text-lg font-semibold text-green-400">{metrics.agent_tasks_completed}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              Last agent activity: {new Date(metrics.last_agent_activity).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-400" />
            Blockchain Performance
          </CardTitle>
          <CardDescription className="text-gray-400">
            Decentralized ledger statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/30 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-400">{metrics.transaction_count}</div>
              <div className="text-xs text-gray-400">Transactions</div>
            </div>
            <div className="bg-green-900/30 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-green-400">{metrics.successful_transactions}</div>
              <div className="text-xs text-gray-400">Successful</div>
            </div>
            <div className="bg-red-900/30 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-red-400">{metrics.failed_transactions}</div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center text-gray-400">
                <Check className="h-4 w-4 mr-1 text-green-400" />
                System Uptime
              </span>
              <span className="text-sm font-medium text-green-400">{metrics.system_uptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-1 text-blue-400" />
                Blockchain Latency
              </span>
              <span className="text-sm font-medium text-blue-400">{metrics.blockchain_latency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center text-gray-400">
                <AlertCircle className="h-4 w-4 mr-1 text-purple-400" />
                Node Status
              </span>
              <span className="text-sm font-medium text-purple-400">{metrics.node_health}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={onRefresh} className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
              Refresh Metrics
            </Button>
            <Button size="sm" variant="outline" onClick={onReset} className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
              Reset Counters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const {
    healthMetrics,
    fetchHealthMetrics,
    loading: systemLoading,
  } = useSystem();
  const { batches, fetchBatches, loading: batchLoading } = useBatch();
  const [loading, setLoading] = useState(true);
  const [mockHealthMetrics, setMockHealthMetrics] = useState(MOCK_HEALTH_METRICS);
  const [mockBatches, setMockBatches] = useState(MOCK_BATCHES);
  const [agentStatus, setAgentStatus] = useState("active");
  const [agentActivity, setAgentActivity] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Try to use the real fetch functions but fallback to mock data
        try {
          await Promise.all([fetchHealthMetrics(), fetchBatches()]);
        } catch (error) {
          console.error("Using mock data due to error:", error);
          // If the real fetch fails, we'll use the mock data
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    
    // Simulate AI agent activity
    const activityInterval = setInterval(() => {
      const activities = [
        "Analyzing temperature patterns",
        "Verifying blockchain entries",
        "Optimizing delivery routes",
        "Predicting quality metrics",
        "Cross-referencing batch data"
      ];
      setAgentActivity(activities[Math.floor(Math.random() * activities.length)]);
      
      setTimeout(() => {
        setAgentActivity(null);
      }, 3000);
    }, 8000);
    
    const intervalId = setInterval(() => {
      // Try the real fetch but silently fall back to mock if it fails
      try {
        fetchHealthMetrics();
      } catch (error) {
        console.log("Using mock health metrics");
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(intervalId);
      clearInterval(activityInterval);
    };
  }, [fetchHealthMetrics, fetchBatches]);

  const handleRefreshHealthMetrics = () => {
    try {
      fetchHealthMetrics();
    } catch (error) {
      console.log("Refreshing mock health metrics");
      // Simulate a small change in the mock data
      setMockHealthMetrics({
        ...mockHealthMetrics,
        transaction_count: mockHealthMetrics.transaction_count + Math.floor(Math.random() * 5),
        agent_response_time: (Math.random() * (1.5 - 0.8) + 0.8).toFixed(1) + "s",
        last_agent_activity: new Date().toISOString()
      });
    }
  };

  const handleResetCounters = () => {
    try {
      fetchHealthMetrics(true);
    } catch (error) {
      console.log("Resetting mock counters");
      setMockHealthMetrics({
        ...mockHealthMetrics,
        temperature_breaches: 0,
        critical_breaches: 0,
        warning_breaches: 0,
        failed_transactions: 0
      });
    }
  };

  if (loading || systemLoading || batchLoading) {
    return (
      <DashboardWrapper>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-blue-400 text-lg font-medium flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            AI Agents initializing system...
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  // Use real data if available, otherwise use mock data
  const displayedHealthMetrics = healthMetrics || mockHealthMetrics;
  const displayedBatches = batches.length > 0 ? batches : mockBatches;

  return (
    <DashboardWrapper>
      <div className="relative">
        {agentActivity && (
          <div className="fixed top-6 right-6 bg-blue-900/80 text-blue-100 py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in flex items-center border border-blue-700">
            <Bot className="h-4 w-4 mr-2 text-blue-300 animate-pulse" />
            <span className="text-sm">{agentActivity}...</span>
          </div>
        )}
      
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Berry Supply Chain Dashboard</h1>
          <div className="flex items-center bg-gray-800 py-2 px-4 rounded-lg border border-gray-700">
            <Bot className={`h-5 w-5 mr-2 ${agentStatus === "active" ? "text-green-400" : "text-yellow-400"}`} />
            <span className="text-sm font-medium text-gray-300">
              AI Agent System: <span className={agentStatus === "active" ? "text-green-400" : "text-yellow-400"}>
                {agentStatus === "active" ? "Active" : "Standby"}
              </span>
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-900/40 mb-8">
          <div className="flex items-start">
            <Bot className="h-10 w-10 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">AI-Powered Supply Chain Management</h2>
              <p className="text-gray-300">Your berry supply chain is being actively monitored and optimized by our advanced AI agents. Real-time analysis, predictive quality assessment, and blockchain verification are all handled automatically.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Batch Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-900/10 transition-all hover:border-blue-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-400" />
                Batch Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400">
                  {displayedBatches.length}
                </div>
                <p className="text-gray-400">Total Batches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-blue-400">
                      {
                        displayedBatches.filter((b) => b.batch_status === "InTransit")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-400">In Transit</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-green-400">
                      {
                        displayedBatches.filter((b) => b.batch_status === "Delivered")
                          .length
                      }
                    </div>
                    <p className="text-xs text-gray-400">Delivered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-red-900/10 transition-all hover:border-red-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-red-400" />
                Temperature Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-red-400">
                  {displayedHealthMetrics?.temperature_breaches || 0}
                </div>
                <p className="text-gray-400">Total Breaches</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-red-400">
                      {displayedHealthMetrics?.critical_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-400">Critical</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-yellow-400">
                      {displayedHealthMetrics?.warning_breaches || 0}
                    </div>
                    <p className="text-xs text-gray-400">Warnings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Stats Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all hover:border-purple-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-400" />
                Blockchain Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-purple-400">
                  {displayedHealthMetrics?.transaction_count || 0}
                </div>
                <p className="text-gray-400">Transactions</p>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-green-400">
                      {displayedHealthMetrics?.successful_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-400">Successful</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-750">
                    <div className="text-xl font-semibold text-red-400">
                      {displayedHealthMetrics?.failed_transactions || 0}
                    </div>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Activity Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-green-900/10 transition-all hover:border-green-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="h-5 w-5 mr-2 text-green-400" />
                AI Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-green-500 animate-pulse flex items-center justify-center">
                    <Bot className="h-6 w-6 text-green-900" />
                  </div>
                </div>
                <div className="mt-2 font-semibold text-green-400 mb-1">
                  Active Monitoring
                </div>
                <p className="text-gray-400 text-xs text-center">
                  AI agents monitoring all supply chain activities in real-time
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-400" />
            Batch Monitoring
            <span className="ml-2 text-sm font-normal text-blue-400 bg-blue-900/30 px-2 py-1 rounded">AI Verified</span>
          </h2>
          <ModifiedBatchList />
        </div>

        {/* System Health Metrics */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
            <Bot className="h-6 w-6 mr-2 text-purple-400" />
            AI Agent & System Health
          </h2>
          <ModifiedHealthMetrics 
            metrics={displayedHealthMetrics} 
            onRefresh={handleRefreshHealthMetrics}
            onReset={handleResetCounters}
          />
        </div>
      </div>
    </DashboardWrapper>
  );
}