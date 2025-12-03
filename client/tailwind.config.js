/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                bg: 'var(--bg)',
                'card-bg': 'var(--card-bg)',
                text: 'var(--text)',
                'text-muted': 'var(--text-muted)',
                'input-bg': 'var(--input-bg)',
                'input-border': 'var(--input-border)',
                success: 'var(--success)',
                danger: 'var(--danger)',
            },
            fontFamily: {
                sans: ['Roboto', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
