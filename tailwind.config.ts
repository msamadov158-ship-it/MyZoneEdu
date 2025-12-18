module.exports = {
    darkMode: 'class', // ⚡ faqat class orqali yoqiladi
    content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],

    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                secondary: '#6b7280',
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
            container: {
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                },
            },
            backgroundImage: {
                myZoneOnline:
                    'linear-gradient(to bottom, #DD0000 0%, #D50000 30%, #CD0000 60%, #C30000 100%)',
            },
        },
    },
    plugins: [],
}
