/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'navy': '#1A1E23', // Dark Navy - Primary background
        'teal': '#00E9A3', // Teal - Primary accent
        
        // Secondary Colors
        'white': '#FFFFFF', // For text on dark backgrounds
        'light-gray': '#E0E0E0', // For secondary text
        'dark-gray': '#2D3239', // For secondary backgrounds and cards
        
        // Status Colors
        'success': '#198754', // Green - "On Track" status
        'warning': '#FFC107', // Amber - "At Risk" status
        'danger': '#DC3545', // Red - "Critical" status
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'h1': '24px',
        'h2': '20px',
        'h3': '18px',
        'body': '16px',
        'small': '14px',
        'caption': '12px',
      },
      spacing: {
        // Base spacing unit: 8px
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
      },
      borderRadius: {
        DEFAULT: '4px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}; 