/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B14",
        surface: "#14141F",
        "surface-elevated": "#1C1C2A",
        accent: "#00E5FF",
        border: "#1F1F2D",
        text: {
          primary: "#F0EEE7",
          secondary: "#8A8A9B",
          tertiary: "#5A5A6B",
        },
        success: "#00FF94",
        warning: "#FFB800",
        error: "#FF4D6D",
      },
      fontFamily: {
        sans: ["SpaceGrotesk_400Regular"],
        medium: ["SpaceGrotesk_500Medium"],
        semibold: ["SpaceGrotesk_600SemiBold"],
        bold: ["SpaceGrotesk_700Bold"],
      },
    },
  },
  plugins: [],
};
