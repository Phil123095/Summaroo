module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bahnschrift: ["Bahnschrift", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {'green-primary': '#00B050'},
      keyframes: {
        movingacross: {
          '0%': { transform: 'translate-x-10' },
          '10%': { transform: 'translate-x-10' },
          '20%': { transform: 'translate-x-10' },
          '30%': { transform: 'translate-x-1' },
          '40%': { transform: 'translate-x-1' },
          '50%': { transform: 'translate-x-1' },
          '60%': { transform: 'translate-x-1' },
          '100%': { transform: 'translate-x-1' },
        },
      },
      animation: {
        'jumping-kangaroo': 'movingacross 2s linear infinite',
      },
    },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
  },
}
