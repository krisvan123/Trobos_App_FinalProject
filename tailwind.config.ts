import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        trobos: {
          primary: "#0B0F19",
          navy: "#0B0F19",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#64748B",
          border: "#E2E8F0",
          orange: "#FF4D00",
          orangeHover: "#E64500",
          accent: "#FF4D00",
          accentHover: "#E64500",
          success: "#059669",
          warning: "#D97706",
          danger: "#DC2626",
          blue: "#2563EB",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        elevated: "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)",
        modal: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
