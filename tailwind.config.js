/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "IBM Plex Sans Arabic",
          "Segoe UI",
          "Tahoma",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        surface: {
          50: "#f8fafc",
          100: "#eef2f6",
          200: "#dbe3ec",
          800: "#17202b",
          850: "#101821",
          900: "#0b1118",
          950: "#060a0f",
        },
        signal: {
          red: "#ef4444",
          amber: "#f59e0b",
          green: "#10b981",
          cyan: "#06b6d4",
          blue: "#3b82f6",
        },
      },
      boxShadow: {
        panel: "0 18px 45px rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [],
};
