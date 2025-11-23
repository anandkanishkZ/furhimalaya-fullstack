import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Ensure all brand color classes are always included
    {
      pattern: /^bg-brand-primary(-\d+|-light|-dark)?$/,
    },
    {
      pattern: /^text-brand-primary(-\d+|-light|-dark)?$/,
    },
    {
      pattern: /^border-brand-primary(-\d+|-light|-dark)?$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#c19d68', // New primary brand color - warm golden bronze
        'brand-red': '#d10202ff',
        'brand-blue': '#0081e4ff',
        'brand-bronze': '#895f35',
        'brand-dark': '#1e293b', // Professional dark gray
        // Brand color variations
        'brand-primary-light': '#d4b382',
        'brand-primary-dark': '#a8844e',
        'brand-primary-50': '#faf8f4',
        'brand-primary-100': '#f2ede1',
        'brand-primary-200': '#e6d7c2',
        'brand-primary-300': '#d9c1a3',
        'brand-primary-400': '#c19d68',
        'brand-primary-500': '#c19d68',
        'brand-primary-600': '#a8844e',
        'brand-primary-700': '#8f6b3e',
        'brand-primary-800': '#76522e',
        'brand-primary-900': '#5d391e',
      },
      spacing: {
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontSize: {
        '2xs': '0.625rem',
        'md': '1rem', // 16px - medium text size
        'first': '2.25rem', // 36px - for subtitle
        '8xl': '6rem',
        '9xl': '8rem',
        '10xl': '10rem',
      },
      fontWeight: {
        'extra-light': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'around': '0 0 15px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'carousel': 'carousel 20s linear infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            maxWidth: 'none',
            h1: {
              color: '#1f2937',
              fontWeight: '800',
            },
            h2: {
              color: '#1f2937',
              fontWeight: '700',
            },
            h3: {
              color: '#1f2937',
              fontWeight: '600',
            },
            a: {
              color: '#c19d68',
              '&:hover': {
                color: '#a8844e',
              },
            },
            blockquote: {
              borderLeftColor: '#c19d68',
              backgroundColor: '#faf8f4',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
            },
          },
        },
        brand: {
          css: {
            '--tw-prose-body': '#374151',
            '--tw-prose-headings': '#1f2937',
            '--tw-prose-lead': '#4b5563',
            '--tw-prose-links': '#c19d68',
            '--tw-prose-bold': '#1f2937',
            '--tw-prose-counters': '#6b7280',
            '--tw-prose-bullets': '#d1d5db',
            '--tw-prose-hr': '#e5e7eb',
            '--tw-prose-quotes': '#1f2937',
            '--tw-prose-quote-borders': '#c19d68',
            '--tw-prose-captions': '#6b7280',
            '--tw-prose-code': '#1f2937',
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': '#1f2937',
            '--tw-prose-th-borders': '#d1d5db',
            '--tw-prose-td-borders': '#e5e7eb',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;