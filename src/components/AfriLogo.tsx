import React from "react";
import { AfricanMaskIcon } from "./AfricanMaskIcon";

interface AfriLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AfriLogo: React.FC<AfriLogoProps> = ({
  size = "md",
  showText = true,
  className = "",
  onClick,
}) => {
  const iconSizes = {
    sm: 26,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const textSizes = {
    sm: "text-base tracking-[0.18em]",
    md: "text-lg md:text-xl tracking-[0.22em]",
    lg: "text-2xl tracking-[0.25em]",
    xl: "text-3xl tracking-[0.28em]",
  };

  return (
    <div
      id="afriversty-logo-container"
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Stylized African Gold Mask Vector Emblem */}
      <div className="transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
        <AfricanMaskIcon size={iconSizes[size]} color="#d4af37" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif-title font-bold text-[#f2ca50] uppercase leading-none ${textSizes[size]}`}
          >
            AFRIVERSTY
          </span>
          <span className="hidden xs:block text-[8px] md:text-[9px] font-sans-body uppercase tracking-[0.24em] text-[#d0c5af]/80 mt-1 font-medium">
            CONNECT &bull; LEARN &bull; BUILD
          </span>
        </div>
      )}
    </div>
  );
};

