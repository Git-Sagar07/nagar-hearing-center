/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B2138',
        navy: {
          DEFAULT: '#0B3D6E',
          50: '#EAF1F8',
          100: '#CFE0EF',
          400: '#1E5A94',
          600: '#0B3D6E',
          700: '#092F55',
          800: '#07253F',
          900: '#051A2E',
        },
        teal: {
          DEFAULT: '#0E9C96',
          50: '#E9FBFA',
          100: '#CFF4F1',
          300: '#7FD9D2',
          500: '#0E9C96',
          600: '#0B7F7A',
          700: '#086663',
        },
        mist: '#F5FAFA',
        sand: '#FBFDFD',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(11, 61, 110, 0.18)',
        card: '0 8px 24px -8px rgba(11, 61, 110, 0.15)',
        glow: '0 0 0 6px rgba(14, 156, 150, 0.12)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.85)', opacity: '0.55' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        ripple1: 'ripple 3.2s ease-out infinite',
        ripple2: 'ripple 3.2s ease-out infinite 1.05s',
        ripple3: 'ripple 3.2s ease-out infinite 2.1s',
        wave: 'wave 1.2s ease-in-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
