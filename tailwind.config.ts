import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textDecorationColor: {
        "custom-yellow": "#F7D109",
      },

      backgroundImage: {
        "restaurant-bg": "url('/bg2.png')",
      },
    },
  },
  plugins: [],
};
export default config;
