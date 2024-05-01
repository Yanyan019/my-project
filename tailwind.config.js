const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors:{
        'custom-color':'#15161a',//medyo dark
        'custome-text-color':'#f1e092',//yellow
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}