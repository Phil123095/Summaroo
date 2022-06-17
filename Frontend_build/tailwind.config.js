module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        'green-primary': '#00B050',
        'blue-base': '#3b5ae3',
        'electric-blue': '#84CEEB',
        'light-blue': '#5AB9EA',
        'light-indigo': '#C1C8E4',
        'violet-base': '#8860D0'
      },
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
      backgroundImage: {
        conic: 'conic-gradient(var(--tw-gradient-stops))',
        'conic-to-t': 'conic-gradient(at top, var(--tw-gradient-stops))',
        'conic-to-b': 'conic-gradient(at bottom, var(--tw-gradient-stops))',
        'conic-to-l': 'conic-gradient(at left, var(--tw-gradient-stops))',
        'conic-to-r': 'conic-gradient(at right, var(--tw-gradient-stops))',
        'conic-to-tl': 'conic-gradient(at top left, var(--tw-gradient-stops))',
        'conic-to-tr': 'conic-gradient(at top right, var(--tw-gradient-stops))',
        'conic-to-bl':
          'conic-gradient(at bottom left, var(--tw-gradient-stops))',
        'conic-to-br':
          'conic-gradient(at bottom right, var(--tw-gradient-stops))',
        radial: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'radial-at-t':
          'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'radial-at-b':
          'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
        'radial-at-l':
          'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
        'radial-at-r':
          'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
        'radial-at-tl':
          'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
        'radial-at-tr':
          'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
        'radial-at-bl':
          'radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))',
        'radial-at-br':
          'radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))'
      },
      animation: {
        'jumping-kangaroo': 'movingacross 2s linear infinite',
      },
    },
  plugins: [require("daisyui"), require("tailwindcss-animate"), require('flowbite/plugin')],
  },
}
