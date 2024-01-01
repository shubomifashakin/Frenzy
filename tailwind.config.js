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
        primaryColor: "#f3f9d2",
        secondaryColor: "#f46036",
        secondaryColorHover: "#FDBA74",
        tertiaryColor: "#2f2f2f",
        transparentSecondary: "#f45f36ab",
      },
    },
  },
  plugins: [],
};
