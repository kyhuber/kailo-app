const tailwindConfig = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2D3748', // An intermediate dark gray for better dark mode gradients
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;