/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#155e75', // Azul Petróleo Oscuro
                    secondary: '#67e8f9', // Cyan/Turquesa
                    accent: '#ffffff', // Blanco
                    background: '#ecfeff', // Celeste pálido
                }
            },
            fontFamily: {
                sans: ['Comfortaa', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
