/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        light: {
          100: "#D6C7FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221F3D",
          200: "#0F0D23",
        },
        accent: "#AB8BFF",
      },
      // colors: {
      //   // primary: "#FB8B24",
      //   primary: "#5F0F40",
      //   accent: "#9A031E",
      //   secondary: "#E36414",
      //   lightest: "#FB8B24",
      //   // background: "#5F0F40",
      //   light: {
      //     100: "#F05941",
      //     200: "#BE3144",
      //     300: "#872341",
      //   },
      //   dark: {
      //     100: "#5F0F40",
      //     200: "#22092C",
      //   },
      // },
    },
  },
  plugins: [],
};
