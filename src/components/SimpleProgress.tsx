"use client";

import React from "react";

interface SimpleProgressProps {
  value: number;
}

const SimpleProgress: React.FC<SimpleProgressProps> = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
      <div
        className="bg-green-500 h-1"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default SimpleProgress;