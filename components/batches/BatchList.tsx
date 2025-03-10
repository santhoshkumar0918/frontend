// import React, { useEffect, useState } from "react";
// import { useBatch } from "../../lib/hooks/useBatch";
// import BatchCard from "./BatchCard";
// import { Button } from "../ui/button";
// import Link from "next/link";

// const BatchList: React.FC = () => {
//   const { loading, error, batches, fetchBatches } = useBatch();
//   const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   useEffect(() => {
//     fetchBatches();
//   }, [fetchBatches]);

//   useEffect(() => {
//     if (statusFilter === "all") {
//       setFilteredBatches(batches);
//     } else {
//       setFilteredBatches(
//         batches.filter((batch) => batch.batch_status === statusFilter)
//       );
//     }
//   }, [batches, statusFilter]);

//   const handleFilterChange = (status: string) => {
//     setStatusFilter(status);
//   };

//   if (loading) {
//     return <div className="text-center py-10">Loading batches...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         <p>Error: {error}</p>
//         <Button onClick={() => fetchBatches()} className="mt-4">
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Berry Batches</h2>
//         <Link href="/batches/create">
//           <Button>Create New Batch</Button>
//         </Link>
//       </div>

//       <div className="flex space-x-2 pb-4 overflow-x-auto">
//         <Button
//           variant={statusFilter === "all" ? "default" : "outline"}
//           size="sm"
//           onClick={() => handleFilterChange("all")}
//         >
//           All
//         </Button>
//         <Button
//           variant={statusFilter === "InTransit" ? "default" : "outline"}
//           size="sm"
//           onClick={() => handleFilterChange("InTransit")}
//         >
//           In Transit
//         </Button>
//         <Button
//           variant={statusFilter === "Delivered" ? "default" : "outline"}
//           size="sm"
//           onClick={() => handleFilterChange("Delivered")}
//         >
//           Delivered
//         </Button>
//         <Button
//           variant={statusFilter === "Rejected" ? "default" : "outline"}
//           size="sm"
//           onClick={() => handleFilterChange("Rejected")}
//         >
//           Rejected
//         </Button>
//       </div>

//       {filteredBatches.length === 0 ? (
//         <div className="text-center py-10 border rounded-lg">
//           <p className="text-gray-500">No batches found</p>
//           {statusFilter !== "all" && (
//             <p className="text-sm text-gray-400 mt-2">
//               Try changing your filter or creating a new batch
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredBatches.map((batch) => (
//             <BatchCard key={batch.batch_id} batch={batch} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BatchList;

import React from "react";
import Link from "next/link";
import { 
  TruckIcon, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Bot,
  BarChart
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { BatchList } from ".";

interface BatchProps {
  batch: {
    batch_id: string;
    batch_name: string;
    batch_status: string;
    creation_date: string;
    estimated_delivery?: string;
    actual_delivery?: string;
    quantity: number;
    origin: string;
    destination: string;
    quality_score: number;
    agent_notes?: string;
    rejection_reason?: string;
    last_updated: string;
  };
}

const BatchCard: React.FC<BatchProps> = ({ batch }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "InTransit":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "InTransit":
        return <TruckIcon size={16} className="text-amber-600" />;
      case "Delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Rejected":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertTriangle size={16} className="text-slate-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQualityColorClass = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Link href={`/batches/${batch.batch_id}`}>
      <Card className="h-full hover:shadow-md transition-shadow duration-200 overflow-hidden border-1">
        <div className={`h-1 w-full ${
          batch.batch_status === "InTransit" ? "bg-amber-500" :
          batch.batch_status === "Delivered" ? "bg-green-500" : "bg-red-500"
        }`}></div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{batch.batch_name}</h3>
              <p className="text-xs text-slate-500">ID: {batch.batch_id}</p>
            </div>
            <div className={`px-3 py-1 rounded-full border flex items-center gap-1 text-xs font-medium ${getStatusColor(batch.batch_status)}`}>
              {getStatusIcon(batch.batch_status)}
              <span>{batch.batch_status}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1 text-slate-700">
              <Calendar size={14} className="text-slate-400" />
              <span>Created:</span>
            </div>
            <div className="text-slate-900">{formatDate(batch.creation_date)}</div>
            
            <div className="flex items-center gap-1 text-slate-700">
              <TruckIcon size={14} className="text-slate-400" />
              <span>{batch.batch_status === "Delivered" ? "Delivered:" : "ETA:"}</span>
            </div>
            <div className="text-slate-900">
              {batch.batch_status === "Delivered" && batch.actual_delivery 
                ? formatDate(batch.actual_delivery) 
                : batch.estimated_delivery 
                  ? formatDate(batch.estimated_delivery)
                  : "N/A"}
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-500" />
                <span className="text-slate-500">Route:</span>
              </div>
              <span className="text-slate-700 font-medium">{`${batch.origin} → ${batch.destination}`}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <BarChart size={14} className="text-slate-500" />
                <span className="text-slate-500">Quality Score:</span>
              </div>
              <span className={`font-bold ${getQualityColorClass(batch.quality_score)}`}>
                {batch.quality_score}/100
              </span>
            </div>
          </div>
          
          {batch.agent_notes && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Bot size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-blue-700 mb-1">AI Agent Notes</div>
                  <p className="text-xs text-blue-800">{batch.agent_notes}</p>
                </div>
              </div>
            </div>
          )}
          
          {batch.rejection_reason && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <div className="flex gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <div>
                  <div className="text-xs font-medium text-red-700">Rejection Reason</div>
                  <p className="text-xs text-red-800">{batch.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 border-t text-xs text-slate-500">
          <div className="w-full flex justify-between items-center">
            <span>{batch.quantity} units</span>
            <span>Updated: {formatDate(batch.last_updated)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BatchList;