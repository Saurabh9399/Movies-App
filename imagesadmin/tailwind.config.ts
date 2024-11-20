import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				error: 'var(--error)',
				background: 'var(--background)',
				input: 'var(--input-color)',
				card: 'var(--card-color)',
				checkbox: 'var(--checkbox-color)',
			},
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
			fontSize: {
				// Headings
				h1: ['64px', { lineHeight: '80px' }],
				h2: ['48px', { lineHeight: '56px' }],
				h3: ['32px', { lineHeight: '40px' }],
				h4: ['24px', { lineHeight: '32px' }],
				h5: ['20px', { lineHeight: '24px' }],
				h6: ['16px', { lineHeight: '24px' }],

				// Body text
				'body-lg': ['20px', { lineHeight: '32px' }],
				body: ['16px', { lineHeight: '24px' }],
				'body-sm': ['14px', { lineHeight: '24px' }],
				'body-xs': ['12px', { lineHeight: '24px' }],

				// Caption
				caption: ['14px', { lineHeight: '16px' }],
			},
			fontWeight: {
				regular: '400',
				semibold: '600',
				bold: '700',
			},
		},
	},
	plugins: [],
} satisfies Config;
