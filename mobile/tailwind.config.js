/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#13eca4",
        "safety-orange": "#ff6b00",
        "background-light": "#f6f8f7",
        "background-dark": "#10221c",
        "slate-rugged": "#1c2e28",
        "border-rugged": "#326755",
      },
      fontFamily: {
        "display": ["SpaceGrotesk_400Regular"] // We'll need to load this font
      },
    },
  },
  plugins: [],
}
