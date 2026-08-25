/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: "#09090b",
          darker: "#030712",
          black: "#000000",
          card: "rgba(18, 18, 23, 0.75)",
          "card-hover": "rgba(28, 28, 36, 0.9)",
          border: "rgba(255, 255, 255, 0.10)",
          "border-subtle": "rgba(255, 255, 255, 0.05)",
          "border-bright": "rgba(255, 255, 255, 0.22)",
          gold: "#d4af37",
          "gold-light": "#fef08a",
          "gold-dark": "#854d0e",
          silver: "#e2e8f0",
          "silver-muted": "#94a3b8",
          red: "#ee0033",
          "red-glow": "#ff2a55",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-silver": "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)",
        "gradient-gold": "linear-gradient(135deg, #fef08a 0%, #eab308 50%, #854d0e 100%)",
        "gradient-rose-gold": "linear-gradient(135deg, #fecdd3 0%, #f43f5e 50%, #9f1239 100%)",
        "gradient-dark-glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "gradient-viettel": "linear-gradient(135deg, #ee0033 0%, #b30026 100%)",
      },
      boxShadow: {
        "glass-sm": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-md": "0 16px 48px 0 rgba(0, 0, 0, 0.55)",
        "glow-red": "0 0 25px -3px rgba(238, 0, 51, 0.45)",
        "glow-gold": "0 0 25px -3px rgba(212, 175, 55, 0.4)",
        "glow-silver": "0 0 25px -3px rgba(255, 255, 255, 0.25)",
        "inner-light": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration, 8s)) infinite linear",
        marquee: "marquee var(--duration, 30s) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration, 30s) infinite linear",
        shimmer: "shimmer 3s infinite linear",
        meteor: "meteor 5s linear infinite",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 3s ease-in-out infinite alternate",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        ripple: "ripple var(--duration, 2s) ease calc(var(--i, 0) * .2s) infinite",
        "spin-slow": "spin 15s linear infinite",
      },
      keyframes: {
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap, 1rem)))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        meteor: {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
          },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-600px)",
            opacity: "0",
          },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        glow: {
          "0%": { filter: "drop-shadow(0 0 12px rgba(238, 0, 51, 0.3))" },
          "100%": { filter: "drop-shadow(0 0 28px rgba(238, 0, 51, 0.7))" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
    },
  },
  plugins: [],
};
