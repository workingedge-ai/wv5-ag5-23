import React from "react";

interface TVAppCardProps {
  name: string;
  icon: string;
  url: string;
  focused?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TVAppCard: React.FC<TVAppCardProps> = ({
  name,
  icon,
  url,
  focused = false,
  className = "",
  style = {}
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl shadow-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-teal-400 ${focused ? "border-teal-400" : ""} bg-background/10 backdrop-blur-sm p-4 "${className}`}
      style={style}
      onClick={() => window.open(url, "_blank")}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name}`}
    >
      <img
        src={icon}
        alt={name}
        className="w-16 h-16 object-cover rounded-xl mb-3"
        style={{ boxShadow: focused ? "0 0 12px 2px #14b8a6" : "none" }}
      />
      <span className={`text-lg font-semibold text-white text-center ${focused ? "text-teal-300" : ""}`}>{name}</span>
    </div>
  );
};

export default TVAppCard;
