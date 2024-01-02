/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { sans: ['"Montserrat", sans-serif'] },
    extend: {
      animation: {
        flash: "flash .5s ease-in-out",
      },

      keyframes: {
        flash: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },

      colors: {
        primaryColor: "#FFFFE8",
        secondaryColor: "#f46036",
        secondaryColorHover: "#f5cea5",
        tertiaryColor: "#d3d3d3",
        transparentSecondary: "#f45f36ab",
      },
    },
  },
  plugins: [],
};
