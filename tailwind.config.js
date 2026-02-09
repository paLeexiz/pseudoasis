/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'headline': ['var(--font-stack-headline)', 'sans-serif'],
        'body': ['var(--font-elms-sans)', 'sans-serif'],
      },
      colors: {
        'dark-purple': '#242038',
        'purple': '#9067C6',
        'light-purple': '#8D86C9',
        'gray-purple': '#CAC4CE',
        'cream': '#F7ECE1',
        'off-white': '#F6F6F6',
      },
    },
  },
  plugins: [],
};