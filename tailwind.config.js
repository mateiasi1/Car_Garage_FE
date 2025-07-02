/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#D8D6D4',
        sidebar: '#1B2845',
        card: '#FFFFFF',
        text: '#1A1A1A',
        activeMenu: '#BFDBFE',
        primary: {
          DEFAULT: '#2E3B61',
          hover: '#3F4D7A',
          disabled: '#A1A7BA',
          text: '#FFFFFF',
        },
        error: '#B84A67',
        success: '#4B9E75',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
