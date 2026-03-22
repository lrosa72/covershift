/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 时尚杂志配色
        fashion: {
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          cream: '#faf8f5',
          ivory: '#f0ebe3',
          gold: '#d4af37',
          goldLight: '#e8d5a3',
          goldDark: '#b8941f',
          silver: '#c0c0c0',
          rose: '#c9a9a6',
          blush: '#e8d5d3',
        },
        neon: {
          purple: '#b026ff',
          blue: '#00d4ff',
          pink: '#ff2d95',
        },
        obsidian: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#242424',
        },
        mac: {
          window: '#f5f5f7',
          windowDark: '#1e1e1e',
          bg: '#ffffff',
          bgDark: '#2c2c2c',
          text: '#1d1d1f',
          textDark: '#f5f5f7',
          textSecondary: '#86868b',
          textSecondaryDark: '#a1a1a6',
          border: '#d2d2d7',
          borderDark: '#424245',
          accent: '#007aff',
        }
      },
      fontFamily: {
        // 时尚杂志字体组合
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', '"Didot"', '"Bodoni Moda"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Didot"', 'serif'],
        mono: ['"SF Mono"', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'tighter': '-0.03em',
        'wide': '0.1em',
        'wider': '0.2em',
        'widest': '0.3em',
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      boxShadow: {
        'fashion': '0 2px 20px rgba(0, 0, 0, 0.08)',
        'fashion-lg': '0 4px 40px rgba(0, 0, 0, 0.12)',
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #e8d5a3 50%, #d4af37 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        'warp-gradient': 'linear-gradient(135deg, #b026ff 0%, #00d4ff 100%)',
        'grid-white': 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
