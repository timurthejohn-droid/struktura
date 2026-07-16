import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#FF5A00",
        "orange-dark": "#B23F00",
        paper: "#F1EFE9",
        ink: "#1A1A1A",
        coal: "#181818",
        "coal-deep": "#101010",
      },
      fontFamily: {
        mono: ["CoFo Sans Mono", "monospace"],
        body: ["Onest", "sans-serif"],
      },
      maxWidth: {
        site: "1440px",
      },
      keyframes: {
        logoScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "logo-scroll": "logoScroll 32s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
