/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        cyan: 'hsl(180, 66%, 49%)',
        violet:{
          'light': 'hsl(257, 7%, 63%)',
          'base': 'hsl(257, 27%, 26%)',
          'dark': 'hsl(260, 8%, 14%)',
        },
        gray: '#eff1f7',
        red: 'hsl(0, 87%, 67%)',
        blue: 'hsl(255, 11%, 22%)',
      },  
    },
  },
  plugins: [],
}
