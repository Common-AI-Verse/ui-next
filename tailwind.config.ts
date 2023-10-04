import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'plex': ['IBMPlex', 'sans'],
      },
      fontWeight: {
        extralight: "200",
        light: "300",
        regular: "400",
        semibold: "600",
      },
      colors:{
        "graphics-red":"#D10000",
        "graphics-green":"#08C400",
        "graphics-blue":"#002AB9",
        "accents-red":"#FF0000",
        "accents-green":"#0FFF00",
        "accents-blue":"#013BFF",
        "common-text":"#848484"
      }
    },
  },
  plugins: [],
}
export default config
