import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1C", // Deep Space Navy
        foreground: "#E0E0E0", // Iridescent Silver
        accent: "#CCFF00",     // Acid Lime
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          bg: "rgba(10, 15, 28, 0.7)",
        },
      },
      backgroundImage: {
        "holographic": "linear-gradient(45deg, #E0E0E0 25%, #FFD1FF 50%, #D1FFFF 75%, #E0E0E0 100%)",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #CCFF00 0deg, transparent 360deg)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
