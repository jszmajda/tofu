const colors = require('tailwindcss/colors')
const themes = require('./lib/themes')

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: themes.map((t) => t.name),
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    themeRoot: ":root"
  }
}
