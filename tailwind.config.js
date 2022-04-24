module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './controls/**/*.{js,ts,jsx,tsx}',
    './node_modules/douhub-ui-web/build/**/*.{js,ts,jsx,tsx}',
    './node_modules/douhub-ui-web-basic/build/**/*.{js,ts,jsx,tsx}',
    './node_modules/douhub-ui-web-platform/build/**/*.{js,ts,jsx,tsx}',
    './node_modules/douhub-ui-web-premium/build/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'xs': '480px',
      // => @media (min-width: 480px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
