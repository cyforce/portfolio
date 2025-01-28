// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Pour les fichiers dans le dossier app
    "./components/**/*.{js,ts,jsx,tsx}",  // Pour les fichiers dans le dossier components
    "./pages/**/*.{js,ts,jsx,tsx}",  // Si vous utilisez également des fichiers dans pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
