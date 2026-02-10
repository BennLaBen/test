/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xxs': '320px',   // iPhone SE, petits Android
      'xs': '360px',    // Android standard
      'xsm': '375px',   // iPhone 6/7/8/SE2
      'sm': '425px',    // iPhone Plus, grands Android
      'md': '768px',    // Tablettes
      'lg': '1024px',   // Tablettes paysage, petits laptops
      'xl': '1280px',   // Laptops
      '2xl': '1536px',  // Grands écrans
    },
    extend: {
      colors: {
        // Couleurs LLEDO - Industrial Blue (Light Mode) / Midnight Pro (Dark Mode)
        primary: {
          50: '#e6f0ff',    // Bleu très clair
          100: '#cce0ff',   // Bleu clair
          200: '#99c2ff',   // Bleu pastel
          300: '#66a3ff',   // Bleu moyen
          400: '#3385ff',   // Bleu vif
          500: '#0047FF',   // Bleu LLEDO électrique (couleur principale logo)
          600: '#003acc',   // Bleu foncé
          700: '#002d99',   // Bleu très foncé
          800: '#1e3a8a',   // Bleu nuit (dark mode primary)
          900: '#172554',   // Bleu nuit profond
          950: '#0f172a',   // Bleu presque noir
        },
        // Rouge LLEDO pour accents et CTA
        accent: {
          50: '#fef2f2',    // Rouge très clair
          100: '#fee2e2',   // Rouge clair
          200: '#fecaca',   // Rouge pastel
          300: '#fca5a5',   // Rouge moyen
          400: '#f87171',   // Rouge vif
          500: '#E61E2B',   // Rouge LLEDO (couleur logo)
          600: '#dc2626',   // Rouge profond
          700: '#b91c1c',   // Rouge foncé
          800: '#991b1b',   // Rouge très foncé
          900: '#7f1d1d',   // Rouge sombre
          950: '#450a0a',   // Rouge presque noir
        },
        // Bleu clair pour dark mode accents
        secondary: {
          50: '#eff6ff',    // Bleu ciel très clair
          100: '#dbeafe',   // Bleu ciel clair
          200: '#bfdbfe',   // Bleu ciel
          300: '#93c5fd',   // Bleu ciel moyen
          400: '#60a5fa',   // Bleu ciel vif
          500: '#3b82f6',   // Bleu clair accent (dark mode)
          600: '#2563eb',   // Bleu royal
          700: '#1d4ed8',   // Bleu roi foncé
          800: '#1e40af',   // Bleu profond
          900: '#1e3a8a',   // Bleu nuit
          950: '#172554',   // Bleu nuit profond
        },
        // Gris neutres pour textes et backgrounds
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',   // Gris métal
          900: '#111827',   // Gris très foncé
          950: '#030712',   // Presque noir
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'parallax': 'parallax 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        parallax: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
