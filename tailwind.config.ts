import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do time — ajuste para a identidade visual do Resenha FC
        primary: {
          DEFAULT: "#0B3D2E",
          light: "#146C43",
          dark: "#062B1F",
        },
        accent: {
          DEFAULT: "#F2B705",
        },
      },
    },
  },
  plugins: [],
};

export default config;
