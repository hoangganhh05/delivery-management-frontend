import React, { useState } from "react";

export function BentoGrid({ className = "", children }) {
  return (
    <div
      className={`grid w-full grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className = "",
  background,
  Icon,
  description,
  href,
  cta,
  tag,
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      key={name}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/60 border border-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-glass-md ${className}`}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(238, 0, 51, 0.15), transparent 80%)`,
        }}
      />

      {/* Card Background Graphic */}
      <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-40 transition-opacity duration-300 overflow-hidden">
        {background}
      </div>

      {/* Top Tag & Icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-red-500 shadow-inner group-hover:scale-110 group-hover:bg-red-600/10 group-hover:border-red-500/30 transition-all duration-300">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        {tag && (
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-neutral-300">
            {tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-6 space-y-2">
        <h3 className="text-lg font-bold text-neutral-100 tracking-tight group-hover:text-white transition-colors">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          {description}
        </p>
      </div>

      {/* Optional CTA */}
      {cta && (
        <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-red-400 group-hover:text-red-300 transition-colors">
          <span>{cta}</span>
          <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      )}
    </div>
  );
}

export default BentoGrid;
