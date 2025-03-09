import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface Prediction {
  timestamp: string | number;
  predictedQuality: number;
  recommendedAction: number | string;
  actionDescription: string;
}

interface QualityPredictionsProps {
  predictions: Prediction[];
}

const QualityPredictions: React.FC<QualityPredictionsProps> = ({
  predictions,
}) => {
  // Format the timestamp
  const formatTimestamp = (timestamp: string | number): string => {
    if (typeof timestamp === "number") {
      return new Date(timestamp * 1000).toLocaleString();
    }
    return timestamp.toString();
  };

  // Map action code to human-readable string and color
  const getActionInfo = (
    action: number | string
  ): { text: string; color: string } => {
    const actionMap: Record<string, { text: string; color: string }> = {
      "0": { text: "No Action", color: "green" },
      "1": { text: "Alert", color: "blue" },
      "2": { text: "Expedite", color: "orange" },
      "3": { text: "Reroute", color: "yellow" },
      "4": { text: "Reject", color: "red" },
    };

    const actionKey = action.toString();
    return actionMap[actionKey] || { text: "Unknown", color: "gray" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        {predictions.length === 0 ? (
          <p className="text-center text-gray-500">No predictions available</p>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction, index) => {
              const actionInfo = getActionInfo(prediction.recommendedAction);

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(prediction.timestamp)}
                      </span>
                      <h4 className="font-medium">
                        Predicted Quality: {prediction.predictedQuality}%
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-${actionInfo.color}-100 text-${actionInfo.color}-800`}
                    >
                      {actionInfo.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {prediction.actionDescription}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityPredictions;
