import daisyui from "daisyui";

export default {
  // Yahan aapko content paths dene ki zaroorat nahi hai (v4 auto-detect karta hai)
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        proctohire: { // Aapka premium custom theme
          "color-scheme": "dark",
          "primary": "#6366f1", // Indigo
          "secondary": "#d946ef", // Fuchsia
          "accent": "#22d3ee", // Cyan
          "neutral": "#1e293b",
          "base-100": "#050505", // Deep dark background
          "base-200": "#0f0f0f", // Cards background
          "base-300": "#1a1a1a", // Borders
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
      "night", // Fallback theme
    ],
  },
};