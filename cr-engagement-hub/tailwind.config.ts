import type { Config } from 'tailwindcss'

const colors = {
  // Primary colors
  dark: "#1A1E23", // Header background
  "dark-gray": "#2D3239", // Sidebar background, card background
  "mid-gray": "#3A3F45", // Progress bar background
  "light-gray": "#6C757D", // Secondary text
  white: "#FFFFFF",
  teal: "#00E9A3", // ClearRoute brand color
  
  // Status colors
  success: "#198754", // On Track - Green 
  warning: "#FFC107", // At Risk - Amber
  danger: "#DC3545", // Critical - Red
  info: "#0DCAF0", // Info - Blue
  
  // Gradients defined in components
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: colors,
      backgroundColor: colors,
      textColor: colors,
      borderColor: colors,
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.12)',
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'h4': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}

export default config 