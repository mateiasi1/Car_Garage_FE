/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F1F5F9',
        surface: '#FFFFFF',
        border: '#CBD5E1',
        sidebar: '#1B2845',
        card: '#FFFFFF',
        'card-alt': '#F8FAFC',
        text: '#1E293B',
        muted: '#334155',
        activeMenu: '#BFDBFE',
        orange: '#FFA500',
        primary: {
          DEFAULT: '#2E3B61',
          hover: '#3F4D7A',
          light: '#EEF2FF',
          disabled: '#94A3B8',
          text: '#FFFFFF',
        },
        error: '#E02424',
        success: '#4B9E75',
        warning: '#FFC107',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
