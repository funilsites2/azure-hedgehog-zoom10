"use client";

import React from "react";
import { useStudentTheme } from "@/context/StudentThemeContext";

interface SimpleProgressProps {
  value: number;
}

const SimpleProgress: React.FC<SimpleProgressProps> = ({ value }) => {
  const { progressColor } = useStudentTheme();

  return (
    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
      <div
        className="h-1"
        style={{
          width: `${value}%`,
          backgroundColor: progressColor,
        }}
      />
    </div>
  );
};

export default SimpleProgress;