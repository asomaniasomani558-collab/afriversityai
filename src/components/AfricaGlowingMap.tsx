import React from "react";

interface AfricaGlowingMapProps {
  className?: string;
  size?: number | string;
}

export const AfricaGlowingMap: React.FC<AfricaGlowingMapProps> = ({
  className = "",
  size = 320,
}) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
      >
        <defs>
          <linearGradient id="africa-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
          </linearGradient>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Africa Continent Outline Path */}
        <path
          d="M 120 20
             C 140 18, 175 22, 195 38
             C 220 58, 255 75, 270 100
             C 285 125, 275 145, 255 160
             C 240 170, 235 185, 230 205
             C 225 230, 220 260, 205 285
             C 195 305, 175 328, 160 330
             C 150 330, 142 320, 138 305
             C 132 280, 120 250, 110 235
             C 98 220, 85 200, 75 185
             C 65 170, 48 162, 38 150
             C 28 138, 20 120, 22 105
             C 24 88, 40 70, 58 60
             C 75 52, 95 48, 105 35
             Z"
          stroke="url(#africa-border-grad)"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          fill="rgba(245, 158, 11, 0.05)"
          filter="url(#gold-glow)"
        />

        {/* Madagascar */}
        <path
          d="M 255 240
             C 262 250, 260 270, 250 280
             C 245 275, 248 255, 255 240 Z"
          stroke="url(#africa-border-grad)"
          strokeWidth="1.8"
          fill="rgba(245, 158, 11, 0.08)"
          filter="url(#gold-glow)"
        />

        {/* Constellation Network Nodes & Pulsing Cities */}
        {/* Cairo */}
        <circle cx="210" cy="55" r="3.5" fill="#fef08a" />
        <circle cx="210" cy="55" r="7" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />

        {/* Dakar */}
        <circle cx="35" cy="115" r="3" fill="#fef08a" />

        {/* Accra / Lagos */}
        <circle cx="95" cy="165" r="3.5" fill="#fef08a" />
        <circle cx="115" cy="170" r="3" fill="#fef08a" />

        {/* Nairobi / Addis */}
        <circle cx="230" cy="175" r="3.5" fill="#fef08a" />
        <circle cx="225" cy="130" r="3" fill="#fef08a" />

        {/* Kigali */}
        <circle cx="195" cy="195" r="3" fill="#fef08a" />

        {/* Cape Town / Johannesburg */}
        <circle cx="155" cy="315" r="3.5" fill="#fef08a" />
        <circle cx="178" cy="275" r="3.5" fill="#fef08a" />

        {/* Network Connection Lines */}
        <line x1="210" y1="55" x2="225" y2="130" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="225" y1="130" x2="230" y2="175" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="230" y1="175" x2="195" y2="195" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="195" y1="195" x2="178" y2="275" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="178" y1="275" x2="155" y2="315" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="35" y1="115" x2="95" y2="165" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="95" y1="165" x2="115" y2="170" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="115" y1="170" x2="195" y2="195" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" />
      </svg>
    </div>
  );
};
