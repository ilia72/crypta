/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#06090f',
          secondary: '#0d1117',
          tertiary: '#161b22',
          panel: '#1c2128',
          hover: '#252c3a',
          elevated: '#21283b',
        },
        border: {
          DEFAULT: '#21262d',
          light: '#30363d',
          focus: '#388bfd',
        },
        accent: {
          DEFAULT: '#58a6ff',
          hover: '#79b8ff',
          dim: '#1f3a5f',
          glow: 'rgba(88, 166, 255, 0.15)',
          gradient: 'linear-gradient(135deg, #58a6ff, #a371f7)',
        },
        profit: '#3fb950',
        loss: '#f85149',
        text: {
          primary: '#e6edf3',
          secondary: '#8b949e',
          muted: '#484f58',
        },
        purple: {
          DEFAULT: '#a371f7',
          hover: '#c284f9',
        },
        gold: {
          DEFAULT: '#d4a72c',
          hover: '#e6b84d',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(88, 166, 255, 0.08)',
        glowStrong: '0 0 30px rgba(88, 166, 255, 0.12)',
        card: '0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(88, 166, 255, 0.05)',
        cardHover: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(88, 166, 255, 0.08)',
        sidebar: '4px 0 24px rgba(0, 0, 0, 0.3)',
        topbar: '0 1px 0 rgba(88, 166, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(88, 166, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(88, 166, 255, 0.2)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
