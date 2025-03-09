"use client";

import React from "react";
import { useParams } from "next/navigation";
import BatchDetailView from "../../../components/batches/BatchDetailView";

export default function BatchDetailsPage() {
  const params = useParams();
  const batchId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <BatchDetailView batchId={batchId} />
    </div>
  );
}
