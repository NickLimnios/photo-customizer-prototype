module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        tablet: '768px',
        desktop: '1024px',
      },
      colors: {
        background: 'rgb(var(--color-background))',
        topbar: 'rgb(var(--color-topbar))',
        surface: 'rgb(var(--color-surface))',
        'accent-bluegray': 'rgb(var(--color-accent-bluegray))',
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
