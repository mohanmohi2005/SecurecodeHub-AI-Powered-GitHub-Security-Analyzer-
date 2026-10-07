/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090b',       // Zinc 950
          card: '#18181b',     // Zinc 900
          border: '#27272a',   // Zinc 800
          muted: '#71717a',    // Zinc 500
          text: '#f4f4f5'      // Zinc 100
        },
        light: {
          bg: '#f8fafc',       // Slate 50
          card: '#ffffff',     // White
          border: '#e2e8f0',   // Slate 200
          muted: '#64748b',    // Slate 500
          text: '#0f172a'      // Slate 900
        },
        severity: {
          critical: '#ef4444', // Red 500
          high: '#f97316',     // Orange 500
          medium: '#eab308',   // Yellow 500
          low: '#3b82f6'       // Blue 500
        }
      }
    },
  },
  plugins: [],
}
