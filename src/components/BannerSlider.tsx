"use client";

import React, { useState, useEffect } from "react";

interface BannerSliderProps {
  banners: string[];
  interval?: number;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  interval = 5000,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, interval);
    return () => clearInterval(timer);
  }, [banners, interval]);

  if (!banners.length) return null;

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg">
      {banners.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Banner ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};