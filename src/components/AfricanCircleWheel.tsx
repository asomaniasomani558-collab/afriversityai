import React from "react";

interface AfricanCircleWheelProps {
  className?: string;
  size?: number;
}

export const AfricanCircleWheel: React.FC<AfricanCircleWheelProps> = ({
  className = "",
  size = 260,
}) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wheel-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7d070" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8c6204" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="wheel-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Glow */}
        <circle cx="130" cy="130" r="120" fill="url(#wheel-center-glow)" />

        {/* Outer Glowing Arc Line */}
        <circle
          cx="130"
          cy="130"
          r="124"
          stroke="url(#wheel-gold-grad)"
          strokeWidth="3.5"
          strokeOpacity="0.9"
          className="drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
        />

        {/* Secondary Outer Thin Concentric Circle */}
        <circle
          cx="130"
          cy="130"
          r="115"
          stroke="#d4af37"
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />

        {/* Inner Circle Track */}
        <circle
          cx="130"
          cy="130"
          r="86"
          stroke="#d4af37"
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />

        {/* Center Small Circle */}
        <circle
          cx="130"
          cy="130"
          r="54"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeOpacity="0.75"
        />
        <circle cx="130" cy="130" r="12" fill="#d4af37" fillOpacity="0.7" />

        {/* Geometric Adinkra Radial Teeth & Spokes */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x1 = 130 + 86 * Math.cos(rad);
          const y1 = 130 + 86 * Math.sin(rad);
          const x2 = 130 + 115 * Math.cos(rad);
          const y2 = 130 + 115 * Math.sin(rad);

          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#d4af37"
                strokeWidth={i % 2 === 0 ? "1.8" : "1"}
                strokeOpacity={i % 2 === 0 ? "0.8" : "0.5"}
              />
              {i % 2 === 0 && (
                <circle
                  cx={130 + 100 * Math.cos(rad)}
                  cy={130 + 100 * Math.sin(rad)}
                  r="2.2"
                  fill="#f7d070"
                  fillOpacity="0.85"
                />
              )}
            </g>
          );
        })}

        {/* Inner Chevron Triangles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          const rad = (angle * Math.PI) / 180;
          const cx = 130 + 70 * Math.cos(rad);
          const cy = 130 + 70 * Math.sin(rad);

          return (
            <polygon
              key={`inner-tri-${i}`}
              points={`${cx},${cy - 5} ${cx + 5},${cy + 5} ${cx - 5},${cy + 5}`}
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeOpacity="0.7"
              transform={`rotate(${angle + 90} ${cx} ${cy})`}
            />
          );
        })}
      </svg>
    </div>
  );
};
