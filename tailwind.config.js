module.exports = {
  content: ["./src/**/*.{html,js}"],
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {},
    colors: {
      white: "#ffffff",
      green: {
        primary: "#66cdaa",
        base: "#59b696",
        dark: "#38836a",
        darker: "#2c6854",
      },
      purple: {
        primary: "#453c9a",
        darker: "#332c7a",
        dark: "#252055",
      },
      gray: {
        primary: "#9b9b9b",
      },
    },
  },
  plugins: [],
};
