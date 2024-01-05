import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'base': '#F5F5FB',
        'success': '#29A867',
        'warning': '#FF7158',
        'alert': '#F32355',
        'pink-red': '#F32355',
        'pink-pale': '#FC5E84',
        'grey-base': '#F3F3F3',
        'grey': '#E4E4E4',
        'grey-dark': '#BBBBBB',
        'grey-secondary': '#C5C5C5'
      }
    },
  },
  plugins: [],
}
export default config
