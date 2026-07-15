/** @type {import('tailwindcss').Config} */
export default {
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
