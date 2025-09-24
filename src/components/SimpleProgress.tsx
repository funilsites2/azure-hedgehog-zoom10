"use client";

import React from "react";

interface SimpleProgressProps {
  value: number;
}

const SimpleProgress: React.FC<SimpleProgressProps> = ({ value }) => {
  const isComplete = value >= 100;

  return (
    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
      <div
        className={`${isComplete ? "bg-green-500" : "bg-gradient-to-r from-green-500 to-green-900"} h-1`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default SimpleProgress;