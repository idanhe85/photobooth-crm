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
        navy:         '#1A1A2E',
        'navy-light': '#FFFFFF',
        'navy-mid':   '#F3F4F6',
        gold:         '#CC9933',
        'gold-light': '#DDB84D',
      },
    },
  },
  plugins: [],
};
export default config;
