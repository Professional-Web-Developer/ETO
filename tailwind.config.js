module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"] ,
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glassBg: 'rgba(255,255,255,0.06)',
        glassBorder: 'rgba(255,255,255,0.12)',
        glassBorderSoft: 'rgba(255,255,255,0.06)'
      }
    }
  },
  plugins: []
};