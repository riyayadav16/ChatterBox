import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#DBEAFE",
          accent: "#3B82F6",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          secondary: "#EFF6FF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
        stroke: "#E2E8F0",
        success: "#22C55E",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)",
        elevated: "0 4px 6px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
        "soft-blue": "0 4px 14px rgba(37,99,235,0.15)",
      },
      borderRadius: {
        "4xl": "1.5rem",
        "3xl": "1.25rem",
        "2xl": "1rem",
      },
      animation: {
        border: "border 4s linear infinite",
        "fade-in": "fadeIn 200ms ease-out both",
        "slide-up": "slideUp 220ms ease-out both",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".65" },
        },
      },
    },
  },
  plugins: [daisyui],
};
