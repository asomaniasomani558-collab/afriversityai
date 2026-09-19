import React from "react";

interface AfricanVerticalBorderProps {
  className?: string;
}

export const AfricanVerticalBorder: React.FC<AfricanVerticalBorderProps> = ({ className = "" }) => {
  return (
    <div className={`w-14 sm:w-16 shrink-0 flex flex-col items-center select-none pointer-events-none opacity-80 ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 60 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="tribal-vertical-pattern" width="60" height="120" patternUnits="userSpaceOnUse">
            {/* Outer border lines */}
            <line x1="2" y1="0" x2="2" y2="120" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="58" y1="0" x2="58" y2="120" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="6" y1="0" x2="6" y2="120" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
            <line x1="54" y1="0" x2="54" y2="120" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />

            {/* Diamond 1 with interior concentric lines */}
            <polygon points="30,8 52,38 30,68 8,38" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeOpacity="0.75" />
            <polygon points="30,16 46,38 30,60 14,38" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.5" />
            <polygon points="30,24 40,38 30,52 20,38" fill="none" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="30" cy="38" r="2.5" fill="#f2ca50" fillOpacity="0.9" />

            {/* Corner Triangles / Chevrons */}
            <path d="M8,10 L22,10 L8,24 Z" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M52,10 L38,10 L52,24 Z" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M8,66 L22,66 L8,52 Z" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M52,66 L38,66 L52,52 Z" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.6" />

            {/* Mid connector symbol */}
            <line x1="12" y1="68" x2="48" y2="68" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="18" y1="72" x2="42" y2="72" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />

            {/* Diamond 2 with geometric hatchings */}
            <polygon points="30,76 52,106 30,136 8,106" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeOpacity="0.75" />
            <polygon points="30,84 46,106 30,128 14,106" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="30" y1="84" x2="30" y2="128" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="14" y1="106" x2="46" y2="106" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.5" />

            {/* Geometric hatching marks in lateral quadrants */}
            <line x1="12" y1="88" x2="24" y2="76" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="48" y1="88" x2="36" y2="76" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="60" height="100%" fill="url(#tribal-vertical-pattern)" />
      </svg>
    </div>
  );
};
