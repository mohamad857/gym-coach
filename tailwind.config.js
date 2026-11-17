/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        gym: {
          bg: '#0B0F17',
          surface: '#131B2B',
          card: '#1A233A',
          border: '#273452',
          neon: '#10B981',
          primary: '#10B981',
          accent: '#06B6D4',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#F3F4F6',
          muted: '#94A3B8'
        }
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
      }
    },
  },
  plugins: [],
}

