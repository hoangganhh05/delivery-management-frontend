import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D Tilt Card with dynamic cursor glare reflection and perspective rotation
 */
export function TiltCard({
  children,
  className = "",
  glareColor = "rgba(238, 0, 51, 0.15)",
  tiltAngle = 12,
  ...props
}) {
  const cardRef = useRef(null);

  // Mouse Coordinates (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth Springs for Awwwards-level fluidity
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Transforms for 3D rotation
  const rotateX = useTransform(springY, [0, 1], [tiltAngle, -tiltAngle]);
  const rotateY = useTransform(springX, [0, 1], [-tiltAngle, tiltAngle]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / rect.width;
    const normalizedY = mouseY / rect.height;

    x.set(normalizedX);
    y.set(normalizedY);

    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-3xl bg-neutral-900/80 border border-white/10 p-6 backdrop-blur-2xl shadow-glass-md transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Glare Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glareColor}, transparent 80%)`,
        }}
      />

      {/* Content with 3D Pop translation */}
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default TiltCard;
