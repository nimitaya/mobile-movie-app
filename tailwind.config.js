/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FB8B24",
        accent: "#9A031E",
        secondary: "#E36414",
        background: "#5F0F40",
        light: {
          100: "#F05941",
          200: "#BE3144",
          300: "#872341"
        },
        dark: {
          100: "#5F0F40",
          200: "#22092C"
        }
      }
    },
  },
  plugins: [],
}