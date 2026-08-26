/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#072B46',
          primary: '#0A3D62',     // Deep Trust-Blue (Primary Brand)
          light: '#0E4F7D',
          sky: '#E0F2FE',
          subtle: '#F0F9FF'
        },
        accent: {
          hover: '#EA580C',
          orange: '#F97316',    // Vibrant Orange (Primary CTA/Accent)
          light: '#FB923C',
          glow: 'rgba(249, 115, 22, 0.25)',
          surface: '#FFF7ED',
          pill: '#FFEDD5'
        },
        surface: {
          white: '#FFFFFF',
          card: '#FFFFFF',
          neutral: '#F3F4F6',   // Cool-toned gray for card separation
          subtle: '#F8FAFC',
          border: '#E5E7EB',
          divider: '#EEF2F6'
        },
        ink: {
          primary: '#0A3D62',   // Primary text emphasis in trust blue
          heading: '#0F172A',
          body: '#334155',
          secondary: '#64748B',
          muted: '#94A3B8'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          star: '#FBBF24'
        }
      },
      fontFamily: {
        sans: ['Inter-Regular', 'system-ui', 'sans-serif'],
        medium: ['Inter-Medium', 'system-ui', 'sans-serif'],
        semibold: ['Inter-SemiBold', 'system-ui', 'sans-serif'],
        bold: ['Inter-Bold', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px'
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(10, 61, 98, 0.05)',
        'soft-md': '0 8px 24px rgba(10, 61, 98, 0.08)',
        'soft-lg': '0 16px 36px rgba(10, 61, 98, 0.12)',
        'orange-glow': '0 8px 25px rgba(249, 115, 22, 0.35)',
        'floating-nav': '0 -4px 30px rgba(10, 61, 98, 0.08)'
      }
    },
  },
  plugins: [],
}
