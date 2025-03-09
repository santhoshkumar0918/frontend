import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { useQuality } from "../../lib/hooks/useQuality";

interface BatchCardProps {
  batch: {
    batch_id: string | number;
    berry_type?: string;
    batch_status?: string;
    quality_score?: number;
    start_time?: string;
    timestamp?: string;
  };
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const { getQualityCategory } = useQuality();

  const qualityInfo = getQualityCategory(batch.quality_score);
  const formattedDate = batch.start_time || batch.timestamp || "Unknown date";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Batch #{batch.batch_id}</CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs text-white bg-${
              batch.batch_status === "InTransit"
                ? "blue"
                : batch.batch_status === "Delivered"
                ? "green"
                : batch.batch_status === "Rejected"
                ? "red"
                : "gray"
            }-500`}
          >
            {batch.batch_status || "Unknown"}
          </div>
        </div>
        <CardDescription>{batch.berry_type || "Unknown type"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Quality Score:</span>
            <span
              className={`text-sm font-semibold text-${qualityInfo.color}-600`}
            >
              {batch.quality_score !== undefined
                ? `${batch.quality_score}%`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Created:</span>
            <span className="text-sm">
              {typeof formattedDate === "string"
                ? formattedDate.slice(0, 10)
                : "Unknown"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between">
          <Link href={`/batches/${batch.batch_id}`} passHref>
            <Button variant="outline" size="sm" className="mr-2">
              View Details
            </Button>
          </Link>
          {batch.batch_status === "InTransit" && (
            <Link
              href={`/temperature/record?batchId=${batch.batch_id}`}
              passHref
            >
              <Button size="sm">Record Temperature</Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BatchCard;
