import React from "react";

export function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className = "",
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-red-600/5 shadow-xl border border-red-500/20"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.max(0.05, opacity),
              animationDelay,
              borderStyle,
              borderWidth: "1px",
            }}
          />
        );
      })}
    </div>
  );
}

export default Ripple;
