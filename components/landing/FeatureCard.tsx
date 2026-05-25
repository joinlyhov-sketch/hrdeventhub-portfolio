import React from "react";
import { MediaItem } from "./types";

interface FeatureCardProps {
  item: MediaItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => {
  return (
    <div className="relative w-full h-112.5 bg-card rounded-xl overflow-hidden shadow-md group">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-grey-900/90 via-grey-900/30 to-transparent flex items-center justify-center">
        <button className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <rect width="60" height="60" rx="30" fill="white" />
            <path
              d="M21.25 30.0038V26.1101C21.25 21.283 24.6771 19.2997 28.8625 21.7205L32.2312 23.6747L35.6 25.6288C39.7854 28.0497 39.7854 32.0018 35.6 34.4226L32.2312 36.3768L28.8625 38.3309C24.6771 40.708 21.25 38.7393 21.25 33.8976V30.0038Z"
              fill="#1C4E8D"
              stroke="#1C4E8D"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start gap-3">
        <span className="type-desc-small-semibold bg-action text-action-foreground px-3 py-1 rounded-full uppercase">
          {item.category}
        </span>
        <h2 className="type-title text-primary-foreground leading-tight max-w-xl">
          {item.title}
        </h2>
      </div>
    </div>
  );
};