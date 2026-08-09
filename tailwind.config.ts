import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05070f",
          900: "#0a0e1a",
          800: "#0f1424",
          700: "#161d33",
        },
        electric: {
          400: "#4f8bff",
          500: "#2f6bff",
          600: "#1c4de0",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        mist: {
          50: "#f6f7fb",
          100: "#eef0f7",
          200: "#e2e5f0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(47,107,255,0.18) 0%, rgba(139,92,246,0.10) 45%, rgba(5,7,15,0) 80%)",
        "cta-gradient": "linear-gradient(135deg, #2f6bff 0%, #7c3aed 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(47,107,255,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
