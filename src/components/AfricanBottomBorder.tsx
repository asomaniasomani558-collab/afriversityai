import React from "react";

interface AfricanBottomBorderProps {
  className?: string;
}

export const AfricanBottomBorder: React.FC<AfricanBottomBorderProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-10 sm:h-12 overflow-hidden select-none pointer-events-none opacity-85 ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="tribal-bottom-strip" width="120" height="48" patternUnits="userSpaceOnUse">
            {/* Top guide line */}
            <line x1="0" y1="2" x2="120" y2="2" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="0" y1="46" x2="120" y2="46" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.4" />

            {/* Symbol 1: Diamond with center sun */}
            <polygon points="20,10 32,24 20,38 8,24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.75" />
            <circle cx="20" cy="24" r="2.5" fill="#f2ca50" />

            {/* Symbol 2: Chevrons / Triangles */}
            <path d="M40,12 L50,24 L40,36" fill="none" stroke="#d4af37" strokeWidth="1.6" strokeOpacity="0.6" />
            <path d="M48,12 L58,24 L48,36" fill="none" stroke="#d4af37" strokeWidth="1.6" strokeOpacity="0.6" />

            {/* Symbol 3: Hourglass / Drum */}
            <polygon points="68,12 84,12 76,24 84,36 68,36 76,24" fill="none" stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.7" />

            {/* Symbol 4: Cross hatch / Adinkra box */}
            <rect x="94" y="14" width="18" height="18" fill="none" stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.65" />
            <line x1="94" y1="14" x2="112" y2="32" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="112" y1="14" x2="94" y2="32" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="48" fill="url(#tribal-bottom-strip)" />
      </svg>
    </div>
  );
};
