import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        federation: {
          background: '#050505',
          panel: '#111111',
          panelSoft: '#1a1a1a',
          accent: '#f97316',
          line: '#2a2a2a'
        }
      },
      boxShadow: {
        glow: '0 0 45px rgba(249, 115, 22, 0.22)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;
