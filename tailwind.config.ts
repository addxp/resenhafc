import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada na cor da camisa do time (tom de areia)
        sand: {
          50: "#FBF8F2",
          100: "#F5EEE0",
          200: "#EBE0C8",
          300: "#DFCDA8",
          400: "#D1B885",
          500: "#C2A56A", // tom principal da camisa
          600: "#A68851",
          700: "#8A6E45",
          800: "#6E5738",
          900: "#59452D",
        },
        primary: {
          DEFAULT: "#8A6E45", // sand-700 como cor de ação principal
          light: "#C2A56A",
          dark: "#59452D",
        },
        accent: {
          DEFAULT: "#0B3D2E", // verde escuro como contraste (opcional, pode remover)
        },
      },
    },
  },
  plugins: [],
};

export default config;
