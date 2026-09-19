import React from "react";

interface AfricaMapLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  onClick?: () => void;
}

export const AfricaMapLogo: React.FC<AfricaMapLogoProps> = ({
  className = "",
  size = "md",
  showTagline = true,
  onClick,
}) => {
  const mapSizes = {
    sm: "w-8 h-9",
    md: "w-9 h-10",
    lg: "w-11 h-12",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* African Continent Silhouette with Geometric Pattern */}
      <div className={`relative ${mapSizes[size]} shrink-0 drop-shadow-[0_2px_10px_rgba(234,88,12,0.3)] transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="africa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="30%" stopColor="#ea580c" />
              <stop offset="70%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <pattern id="africa-kente-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#ea580c" />
              <polygon points="0,0 10,10 0,20" fill="#f59e0b" />
              <polygon points="20,0 10,10 20,20" fill="#2563eb" />
              <polygon points="0,0 20,0 10,10" fill="#1e293b" />
              <polygon points="0,20 20,20 10,10" fill="#b91c1c" />
              <circle cx="10" cy="10" r="2" fill="#fef08a" />
            </pattern>

            <clipPath id="africa-continent-clip">
              {/* African Continent Geographic Contour */}
              <path d="M 32 8 C 45 6, 75 8, 85 18 C 92 25, 96 32, 92 42 C 87 48, 82 50, 78 55 C 72 62, 68 72, 62 82 C 55 94, 50 106, 44 112 C 40 114, 37 110, 36 102 C 34 88, 30 75, 22 68 C 14 62, 8 52, 6 42 C 4 30, 10 18, 22 12 Z" />
            </clipPath>
          </defs>

          {/* Africa Silhouette Base Fill */}
          <path
            d="M 32 8 C 45 6, 75 8, 85 18 C 92 25, 96 32, 92 42 C 87 48, 82 50, 78 55 C 72 62, 68 72, 62 82 C 55 94, 50 106, 44 112 C 40 114, 37 110, 36 102 C 34 88, 30 75, 22 68 C 14 62, 8 52, 6 42 C 4 30, 10 18, 22 12 Z"
            fill="url(#africa-kente-pattern)"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Overlay glow/shimmer lines */}
          <path
            d="M 32 8 C 45 6, 75 8, 85 18 C 92 25, 96 32, 92 42 C 87 48, 82 50, 78 55 C 72 62, 68 72, 62 82 C 55 94, 50 106, 44 112 C 40 114, 37 110, 36 102 C 34 88, 30 75, 22 68 C 14 62, 8 52, 6 42 C 4 30, 10 18, 22 12 Z"
            fill="none"
            stroke="#d4af37"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />

          {/* Madagascar Island */}
          <path
            d="M 82 82 C 85 80, 88 88, 84 96 C 81 100, 78 94, 80 88 Z"
            fill="#ea580c"
            stroke="#f59e0b"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Brand Name and Subtitle */}
      <div className="flex flex-col">
        <span
          className={`font-sans-body font-bold lowercase tracking-tight text-[#f5f5f4] leading-tight group-hover:text-[#f2ca50] transition-colors ${titleSizes[size]}`}
        >
          afriversty
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-sans-body text-[#a8a29e] tracking-tight whitespace-nowrap">
            Your Ambition. Your Path. <span className="text-[#f59e0b] font-medium">Your Africa.</span>
          </span>
        )}
      </div>
    </div>
  );
};
