
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			}
		},
		extend: {
			fontFamily: {
				sans: ['Boldonse', 'sans-serif'],
				boldonse: ['Boldonse', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				psyco: {
					green: {
						DEFAULT: '#10B981', // Primary green
						light: '#34D399', // Lighter green
						dark: '#059669', // Darker green
						muted: 'rgba(16, 185, 129, 0.1)' // Transparent green for backgrounds
					},
					black: {
						DEFAULT: '#121212', // Deep black
						light: '#1E1E1E', // Lighter black
						card: 'rgba(30, 30, 30, 0.7)' // Semi-transparent black for cards
					}
				},
				'ai-blue': 'hsl(var(--ai-blue))',
				'ai-blue-glow': 'hsl(var(--ai-blue-glow))',
				'ai-muted': 'hsl(var(--ai-muted))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' },
					'50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.7)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'glow': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '1' }
				},
				'rain': {
					'0%': { transform: 'translateY(-100vh)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'snow': {
					'0%': { transform: 'translateY(-100vh) rotate(0deg)' },
					'100%': { transform: 'translateY(100vh) rotate(360deg)' }
				},
				'lightning': {
					'0%, 90%, 100%': { opacity: '0' },
					'5%, 15%': { opacity: '1' }
				},
				'slide-slow': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'slide-slow-reverse': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'waveform': {
					'0%, 100%': { transform: 'scaleY(0.3)' },
					'50%': { transform: 'scaleY(1)' }
				},
				'ai-pulse-complex': {
					'0%': { 
						boxShadow: '0 0 0 0 hsl(var(--ai-blue) / 0.7)',
						transform: 'scale(1)' 
					},
					'25%': { 
						boxShadow: '0 0 0 8px hsl(var(--ai-blue) / 0.3)',
						transform: 'scale(1.02)' 
					},
					'50%': { 
						boxShadow: '0 0 0 15px hsl(var(--ai-blue) / 0.1)',
						transform: 'scale(1)' 
					},
					'75%': { 
						boxShadow: '0 0 0 8px hsl(var(--ai-blue) / 0.2)',
						transform: 'scale(1.01)' 
					},
					'100%': { 
						boxShadow: '0 0 0 0 hsl(var(--ai-blue) / 0)',
						transform: 'scale(1)' 
					}
				},
				'border-bleed': {
					'0%': { 
						'border-image-source': 'linear-gradient(90deg, hsl(var(--ai-blue)) 0%, transparent 0%)',
						'border-image-slice': '1'
					},
					'100%': { 
						'border-image-source': 'linear-gradient(90deg, hsl(var(--ai-blue)) 100%, transparent 0%)',
						'border-image-slice': '1'
					}
				},
				'ai-glow-pulse': {
					'0%, 100%': { 
						opacity: '0.3',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '0.6',
						transform: 'scale(1.02)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.5s ease-out forwards',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'float': 'float 3s infinite ease-in-out',
				'glow': 'glow 2s infinite ease-in-out',
				'rain': 'rain 1.5s linear infinite',
				'snow': 'snow 4s linear infinite',
				'lightning': 'lightning 3s infinite',
				'slide-slow': 'slide-slow 20s linear infinite',
				'slide-slow-reverse': 'slide-slow-reverse 25s linear infinite',
				'waveform': 'waveform 0.6s ease-in-out infinite',
				'waveform-delayed': 'waveform 0.8s ease-in-out infinite 0.2s',
				'waveform-delayed-2': 'waveform 0.7s ease-in-out infinite 0.4s',
				'ai-pulse-complex': 'ai-pulse-complex 3s ease-in-out infinite',
				'border-bleed': 'border-bleed 2s ease-in-out forwards',
				'ai-glow-pulse': 'ai-glow-pulse 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			},
			opacity: {
				'92': '0.92'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
