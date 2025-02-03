import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			gunmetal: {
  				'100': '#090a0d',
  				'200': '#12141b',
  				'300': '#1b1e28',
  				'400': '#242735',
  				'500': '#2d3142',
  				'600': '#4e5472',
  				'700': '#71799e',
  				'800': '#a0a6bf',
  				'900': '#d0d2df',
  				DEFAULT: '#2d3142'
  			},
  			silver: {
  				'100': '#262727',
  				'200': '#4c4d4d',
  				'300': '#727474',
  				'400': '#989a9a',
  				'500': '#bfc0c0',
  				'600': '#cbcdcd',
  				'700': '#d8d9d9',
  				'800': '#e5e6e6',
  				'900': '#f2f2f2',
  				DEFAULT: '#bfc0c0'
  			},
  			white: {
  				'100': '#333333',
  				'200': '#666666',
  				'300': '#999999',
  				'400': '#cccccc',
  				'500': '#ffffff',
  				'600': '#ffffff',
  				'700': '#ffffff',
  				'800': '#ffffff',
  				'900': '#ffffff',
  				DEFAULT: '#ffffff'
  			},
  			coral: {
  				'100': '#3b1505',
  				'200': '#762b0b',
  				'300': '#b04010',
  				'400': '#e95718',
  				'500': '#ef8354',
  				'600': '#f29a75',
  				'700': '#f5b497',
  				'800': '#f9cdba',
  				'900': '#fce6dc',
  				DEFAULT: '#ef8354'
  			},
  			paynes_gray: {
  				'100': '#101217',
  				'200': '#1f252e',
  				'300': '#2f3745',
  				'400': '#3f4a5c',
  				'500': '#4f5d75',
  				'600': '#687a99',
  				'700': '#8e9bb2',
  				'800': '#b4bdcc',
  				'900': '#d9dee5',
  				DEFAULT: '#4f5d75'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
