const { nextui } = require("@nextui-org/react");

const primaryColor = "#BF9F72";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: primaryColor,
      },
      fontFamily: {
        sans: ["var(--font-gilda)", "serif"],
        serif: ["var(--font-gilda)", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
      },

      /* ---------- CONTAINER ---------- */
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },

      /* ---------- MARQUEE ANIMATION ---------- */
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },

  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: primaryColor,
            background: "#FFFFFF",
          },
        },
      },
    }),
  ],
};
