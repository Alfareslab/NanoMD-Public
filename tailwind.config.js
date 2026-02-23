/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'bg-tertiary': 'var(--bg-tertiary)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                'border-default': 'var(--border-default)',
                'border-hover': 'var(--border-hover)',
                'accent': 'var(--accent-primary)',
                'accent-hover': 'var(--accent-primary-hover)',
                'accent-blue': 'var(--accent-secondary)',
                'accent-success': 'var(--accent-success)',
                'accent-danger': 'var(--accent-danger)',
            },
            fontFamily: {
                sans: ['Inter', 'IBM Plex Sans Arabic', 'Cairo', 'ui-sans-serif', 'system-ui'],
                display: ['Outfit', 'IBM Plex Sans Arabic', 'Cairo', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            fontWeight: {
                normal: '500',
                semibold: '600',
                bold: '700',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
            }
        },
    },
    plugins: [],
}
