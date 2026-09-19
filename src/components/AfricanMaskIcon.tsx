import React from "react";

interface AfricanMaskIconProps {
  size?: number | string;
  className?: string;
  color?: string;
}

export const AfricanMaskIcon: React.FC<AfricanMaskIconProps> = ({
  size = 38,
  className = "",
  color = "#d4af37",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="afri-mask-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d070" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b38f28" />
        </linearGradient>
      </defs>

      {/* Group with gold fill */}
      <g fill="url(#afri-mask-gold-grad)">
        {/* 1. Top Center Teardrop / Leaf */}
        <path d="M 50 5 C 44 14, 44 20, 50 28 C 56 20, 56 14, 50 5 Z" />

        {/* 2. Top Left Forehead Outer Wing */}
        <path d="M 45 6 C 36 8, 28 14, 23 23 C 28 23, 35 19, 43 14 Z" />

        {/* 3. Top Right Forehead Outer Wing */}
        <path d="M 55 6 C 64 8, 72 14, 77 23 C 72 23, 65 19, 57 14 Z" />

        {/* 4. Forehead Upper Left Chevron Arch */}
        <path d="M 47 18 C 39 23, 31 29, 21 34 C 23 27, 27 21, 33 16 C 39 20, 44 22, 47 18 Z" />

        {/* 5. Forehead Upper Right Chevron Arch */}
        <path d="M 53 18 C 61 23, 69 29, 79 34 C 77 27, 73 21, 67 16 C 61 20, 56 22, 53 18 Z" />

        {/* 6. Forehead Central V-Band */}
        <path d="M 50 32 L 36 26 C 32 30, 27 34, 20 38 C 28 39, 38 35, 47 38 L 50 32 Z" />
        <path d="M 50 32 L 64 26 C 68 30, 73 34, 80 38 C 72 39, 62 35, 53 38 L 50 32 Z" />

        {/* 7. Eyebrow Arches */}
        <path d="M 47 42 C 38 41, 28 44, 20 49 C 22 44, 28 41, 36 39 C 41 40, 45 41, 47 42 Z" />
        <path d="M 53 42 C 62 41, 72 44, 80 49 C 78 44, 72 41, 64 39 C 59 40, 55 41, 53 42 Z" />

        {/* 8. Left Eye Frame (Almond Loop) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 18 54 C 18 47, 43 45, 46 54 C 44 62, 20 63, 18 54 Z M 25 54 C 25 58, 38 58, 39 54 C 38 50, 26 50, 25 54 Z"
        />

        {/* 9. Right Eye Frame (Almond Loop) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 82 54 C 82 47, 57 45, 54 54 C 56 62, 80 63, 82 54 Z M 75 54 C 75 58, 62 58, 61 54 C 62 50, 74 50, 75 54 Z"
        />

        {/* 10. Center Nose Bridge & Flared Base */}
        <path d="M 47 44 L 53 44 L 53 66 L 59 66 L 59 71 L 41 71 L 41 66 L 47 66 Z" />

        {/* 11. Left Cheek Geometric Curved Band */}
        <path d="M 17 60 C 18 69, 21 78, 28 85 C 26 77, 25 69, 29 64 C 23 64, 19 62, 17 60 Z" />

        {/* 12. Right Cheek Geometric Curved Band */}
        <path d="M 83 60 C 82 69, 79 78, 72 85 C 74 77, 75 69, 71 64 C 77 64, 81 62, 83 60 Z" />

        {/* 13. Left Upper Lip & Mouth Structure */}
        <path d="M 48 76 C 41 76, 32 78, 28 82 C 34 85, 42 84, 48 83 Z" />

        {/* 14. Right Upper Lip & Mouth Structure */}
        <path d="M 52 76 C 59 76, 68 78, 72 82 C 66 85, 58 84, 52 83 Z" />

        {/* 15. Lower Lip (Pill Oval) */}
        <path d="M 50 86 C 41 86, 34 88, 34 92 C 34 96, 44 98, 50 98 C 56 98, 66 96, 66 92 C 66 88, 59 86, 50 86 Z" />

        {/* 16. Left Lower Jaw / Chin Flank */}
        <path d="M 30 90 C 26 95, 29 101, 35 106 C 39 109, 44 111, 47 112 L 47 104 C 42 103, 37 99, 33 93 Z" />

        {/* 17. Right Lower Jaw / Chin Flank */}
        <path d="M 70 90 C 74 95, 71 101, 65 106 C 61 109, 56 111, 53 112 L 53 104 C 58 103, 63 99, 67 93 Z" />

        {/* 18. Left Chin Bottom Notch Accent */}
        <path d="M 36 88 L 29 93 L 26 87 Z" />

        {/* 19. Right Chin Bottom Notch Accent */}
        <path d="M 64 88 L 71 93 L 74 87 Z" />
      </g>
    </svg>
  );
};
