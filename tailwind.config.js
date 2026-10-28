/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme variables mapping
        app: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-2': 'var(--surface-2)',
          border: 'var(--border)',
          text: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        // Brand & Night Road Tokens
        nr: {
          lime: '#B6F23C',
          'lime-hover': '#C9FF5A',
          'lime-pressed': '#9AD42A',
          apricot: '#FF9F6B',
          'apricot-hover': '#FFB487',
          aqua: '#3FE0C5',
          // Status Tokens
          mint: '#34D399',      // Ready
          amber: '#FFC24B',     // Due soon
          coral: '#FF5D6C',     // Blocked / Danger / Emergency
          lavender: '#8B9CFF',  // Verification pending
          slate: '#94A3A0',     // Offline / Stale
        }
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        btn: '14px',
        input: '12px',
        card: '20px',
        chip: '999px',
      },
      transitionDuration: {
        180: '180ms',
      },
      boxShadow: {
        'lime-glow': '0 8px 24px rgba(182, 242, 60, 0.25)',
        'aqua-glow': '0 8px 24px rgba(63, 224, 197, 0.25)',
        'coral-glow': '0 8px 24px rgba(255, 93, 108, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(8, 32, 28, 0.08)',
        'card-hover': '0 10px 28px -4px rgba(8, 32, 28, 0.16)',
      }
    },
  },
  plugins: [],
}
