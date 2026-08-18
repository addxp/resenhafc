import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tom de areia — cor da camisa do time
        sand: {
          50: "#FBF8F2",
          100: "#F5EEE0",
          200: "#EBE0C8",
          300: "#DFCDA8",
          400: "#D1B885",
          500: "#C2A56A",
          600: "#A68851",
          700: "#8A6E45",
          800: "#6E5738",
          900: "#241C14",
        },
        primary: {
          DEFAULT: "#8A6E45",
          light: "#C2A56A",
          dark: "#241C14",
        },
        // Verde escuro de quadra — usado com moderação, para placares e destaques
        court: {
          DEFAULT: "#1F3D33",
          light: "#2E5C4C",
          dark: "#132821",
        },
        gold: "#D9A441",
        ink: "#241C14",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
