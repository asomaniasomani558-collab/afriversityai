import React from "react";

interface AfriEmblemProps {
  size?: "inline" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}

export const AfriEmblem: React.FC<AfriEmblemProps> = ({
  size = "md",
  className = "",
  glow = true,
}) => {
  const sizeClasses = {
    inline: "w-6 h-6 inline-block align-middle ml-1.5",
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden border border-[#d4af37]/60 bg-[#14120e] ${
        sizeClasses[size]
      } ${
        glow ? "shadow-[0_0_10px_rgba(242,202,80,0.35)]" : ""
      } ${className}`}
    >
      <img
        src="/afriversty_gold_mask.jpg"
        alt="Afriversty Gold Mask Emblem"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};
