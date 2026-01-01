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
        // Light Mode
        light: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          text: {
            primary: '#1A1A1A',
            secondary: '#666666',
          },
          border: '#E0E0E0',
        },
        // Dark Mode
        dark: {
          bg: '#0A0A0A',
          surface: '#1A1A1A',
          text: {
            primary: '#F5F5F5',
            secondary: '#A0A0A0',
          },
          border: '#2A2A2A',
        },
        // Pastel Colors (Light Mode)
        pastel: {
          red: '#FFB3BA',
          yellow: '#FFFFBA',
          green: '#BAFFC9',
          blue: '#BAE1FF',
          orange: '#FFDFBA',
          purple: '#E0BBE4',
          pink: '#FFD5E5',
        },
        // Muted Pastels (Dark Mode)
        muted: {
          red: '#B8868A',
          yellow: '#C4C48A',
          green: '#8AB893',
          blue: '#8AA7B8',
          orange: '#B8A58A',
          purple: '#A88AAC',
          pink: '#B88A9A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}