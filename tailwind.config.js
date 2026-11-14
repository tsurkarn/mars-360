/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#080d1a',
          850: '#0d1527',
          800: '#131e36',
          700: '#1c2b4d',
          600: '#2a3d69',
        },
        mars: {
          rust: '#99351e',
          orange: '#e05333',
          crimson: '#c2410c',
          amber: '#f97316',
          sand: '#ca8a04',
          surface: '#1c1313',
        },
        telemetry: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#818cf8',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Chakra Petch"', '"Rajdhani"', 'system-ui', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 20px -3px rgba(224, 83, 51, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
};
