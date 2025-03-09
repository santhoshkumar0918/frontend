import React from "react";

interface QualityIndicatorProps {
  score: number;
  category: string;
  color: string;
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({
  score,
  category,
  color,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-${color}-500`}
      >
        <span className={`text-2xl font-bold text-${color}-600`}>{score}%</span>
      </div>
      <span className={`mt-2 font-semibold text-${color}-600`}>{category}</span>
    </div>
  );
};

export default QualityIndicator;
