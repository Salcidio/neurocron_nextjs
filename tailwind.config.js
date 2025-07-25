// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // You can keep this for safety
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // This line is crucial for the app directory
  ],
  theme: {
    extend: {
      animation: {
        // Your existing animations
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',

        // New neon chat animations
        'bounce': 'bounce 1s infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 1.5s ease-in-out infinite',
      },
      keyframes: {
        // Your existing keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        // New neon keyframes
        'neon-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 5px rgb(168 85 247), 0 0 10px rgb(168 85 247), 0 0 15px rgb(168 85 247)',
            'border-color': 'rgb(168 85 247)'
          },
          '50%': {
            'box-shadow': '0 0 10px rgb(6 182 212), 0 0 20px rgb(6 182 212), 0 0 30px rgb(6 182 212)',
            'border-color': 'rgb(6 182 212)'
          },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgb(168 85 247 / 0.5)' },
          '100%': { 'box-shadow': '0 0 30px rgb(6 182 212 / 0.8)' },
        },
        typing: {
          '0%, 20%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      // Add custom colors for neon theme
      colors: {
        'neon-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        'neon-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Adding custom blue and pink shades
        'neon-blue': {
          50: '#e0f2fe',
          100: '#bae6fd',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#164e63',
        },
        'neon-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      // Add custom gradients
      backgroundImage: {
        'neon-gradient': 'linear-gradient(45deg, #a855f7, #06b6d4)',
        'neon-gradient-hover': 'linear-gradient(45deg, #9333ea, #0891b2)',
        // Modified to blue-pink gradient
        'chat-gradient': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1))',
        'blue-pink-gradient': 'linear-gradient(to right, #3b82f6, #ec4899)', // Tailwind blue-500 to pink-500
        'blue-pink-gradient-br': 'linear-gradient(to bottom right, #3b82f6, #ec4899)', // Bottom-right blue to pink
      },
      // Custom box shadows for neon effects
      boxShadow: {
        'neon-purple': '0 0 20px rgb(168 85 247 / 0.5)',
        'neon-cyan': '0 0 20px rgb(6 182 212 / 0.5)',
        'neon-glow': '0 0 30px rgb(168 85 247 / 0.3), 0 0 60px rgb(6 182 212 / 0.3)',
        // Adjusted for blue/pink
        'blue-glow': '0 0 30px rgb(59 130 246 / 0.3), 0 0 60px rgb(236 72 153 / 0.3)',
      },
    },
  },
  plugins: [],
}