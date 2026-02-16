/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#1E40AF",
                secondary: "#475569",
                dark: "#0F172A",
                brand: {
                    bg: "#F8FAFC",
                },
            },
            fontFamily: {
                sans: ["Noto Sans KR", "sans-serif"],
            },
            keyframes: {
                "scan-v": {
                    "0%": { top: "-10%" },
                    "100%": { top: "110%" },
                },
                "scan-h": {
                    "0%": { left: "-10%" },
                    "100%": { left: "110%" },
                },
            },
            animation: {
                "scan-v": "scan-v 3s linear infinite",
                "scan-h": "scan-h 3s linear infinite",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "spin-slow": "spin 3s linear infinite",
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                ".glass": {
                    "background-color": "rgba(255, 255, 255, 0.7)",
                    "backdrop-filter": "blur(20px)",
                    "-webkit-backdrop-filter": "blur(20px)",
                    "border": "1px solid rgba(15, 23, 42, 0.05)",
                    "box-shadow": "0 8px 32px 0 rgba(15, 23, 42, 0.05)",
                },
                ".glass-dark": {
                    "background-color": "#FFFFFF",
                    "backdrop-filter": "none",
                    "border": "1px solid rgba(15, 23, 42, 0.1)",
                    "box-shadow": "0 20px 40px -12px rgba(15, 23, 42, 0.1)",
                },
                ".section-padding": {
                    "padding-top": "6rem",
                    "padding-bottom": "6rem",
                    "@screen md": {
                        "padding-top": "10rem",
                        "padding-bottom": "10rem",
                    },
                },
                ".container-custom": {
                    "max-width": "80rem",
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "padding-left": "1.5rem",
                    "padding-right": "1.5rem",
                    "@screen md": {
                        "padding-left": "3rem",
                        "padding-right": "3rem",
                    },
                },
                ".btn-primary": {
                    "background-color": "#1E40AF",
                    "color": "white",
                    "padding-left": "2.5rem",
                    "padding-right": "2.5rem",
                    "padding-top": "1.25rem",
                    "padding-bottom": "1.25rem",
                    "border-radius": "1rem",
                    "font-weight": "900",
                    "transition-property": "all",
                    "transition-duration": "150ms",
                    "box-shadow": "0 10px 20px rgba(30, 64, 175, 0.2)",
                    "&:hover": {
                        "transform": "scale(1.05)",
                        "box-shadow": "0 15px 30px rgba(30, 64, 175, 0.3)",
                    },
                    "&:active": {
                        "transform": "scale(0.95)",
                    },
                },
            });
        },
    ],
};
