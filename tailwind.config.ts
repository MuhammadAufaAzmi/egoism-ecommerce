import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        outline: "#7e7576",
        "surface-tint": "#5e5e5e",
        "surface-container-low": "#f3f3f3",
        secondary: "#5e5e5e",
        "secondary-container": "#e1dfdf",
        error: "#ba1a1a",
        "on-secondary-container": "#626262",
        "on-secondary": "#ffffff",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#c6c6c6",
        tertiary: "#000000",
        "primary-fixed": "#e2e2e2",
        "on-primary-fixed-variant": "#474747",
        "surface-bright": "#f9f9f9",
        "surface-container-high": "#e8e8e8",
        "primary-fixed-dim": "#c6c6c6",
        "on-error-container": "#93000a",
        "on-tertiary-container": "#848484",
        "surface-container-highest": "#e2e2e2",
        "on-tertiary-fixed": "#1b1b1b",
        primary: "#000000",
        "tertiary-container": "#1b1b1b",
        "surface-container-lowest": "#ffffff",
        "on-background": "#1a1c1c",
        "inverse-primary": "#c6c6c6",
        "on-surface": "#1a1c1c",
        "on-primary": "#ffffff",
        "inverse-surface": "#2f3131",
        "on-primary-container": "#848484",
        surface: "#f9f9f9",
        "surface-container": "#eeeeee",
        "outline-variant": "#cfc4c5",
        "inverse-on-surface": "#f1f1f1",
        background: "#f9f9f9",
        "primary-container": "#1b1b1b",
        "surface-variant": "#e2e2e2",
        "on-tertiary": "#ffffff",
        "secondary-fixed": "#e4e2e2",
        "on-error": "#ffffff",
        "secondary-fixed-dim": "#c7c6c6",
        "on-surface-variant": "#4c4546",
        "surface-dim": "#dadada",
        "tertiary-fixed": "#e2e2e2",
      },
      spacing: {
        unit: "8px",
        "margin-desktop": "64px",
        gutter: "24px",
        "margin-mobile": "20px",
        "container-max": "1440px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      fontFamily: {
        // Sporty heading — Bebas Neue (all-caps, ultra bold condensed)
        heading: ["var(--font-bebas)", "sans-serif"],
        // Sporty body — Barlow Condensed (clean, modern, athletic)
        body: ["var(--font-barlow)", "sans-serif"],
        // Shorthand aliases matching old usage patterns
        "headline-lg-mobile": ["var(--font-bebas)", "sans-serif"],
        "button-text": ["var(--font-barlow)", "sans-serif"],
        "display-lg": ["var(--font-bebas)", "sans-serif"],
        "body-md": ["var(--font-barlow)", "sans-serif"],
        "label-caps": ["var(--font-barlow)", "sans-serif"],
        "body-lg": ["var(--font-barlow)", "sans-serif"],
        "headline-lg": ["var(--font-bebas)", "sans-serif"],
        "headline-md": ["var(--font-bebas)", "sans-serif"],
      },
      fontSize: {
        "headline-lg-mobile": [
          "32px",
          { lineHeight: "36px", letterSpacing: "0.05em", fontWeight: "400" },
        ],
        "button-text": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.12em", fontWeight: "600" },
        ],
        "display-lg": [
          "80px",
          { lineHeight: "84px", letterSpacing: "0.08em", fontWeight: "400" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.15em", fontWeight: "600" },
        ],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg": [
          "48px",
          { lineHeight: "52px", letterSpacing: "0.06em", fontWeight: "400" },
        ],
        "headline-md": [
          "32px",
          { lineHeight: "36px", letterSpacing: "0.04em", fontWeight: "400" },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
