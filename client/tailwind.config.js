/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        aqua: {
          100: '#A9E8E8',
          200: '#B1E8ED',
          300: '#83CCD2',
          400: '#ADE1EF',
          500: '#C8EBEF',
          600: '#B2EAD3'
        },
        peach: {
          50: '#FFF9F6',
          100: '#FFEDE3',
          200: '#FAD6C4',
          300: '#F6BFA0',
          400: '#F3A982'
        },
        textsoft: '#2B2B2B'
      },
      fontFamily: {
        // Set Inter as the default sans font via utility usage
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        poppins: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 10px 25px rgba(250, 214, 196, 0.35)'
      }
    }
  },
  plugins: []
}
