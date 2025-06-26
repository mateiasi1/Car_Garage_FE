import react from "@vitejs/plugin-react-swc";

export default {
    plugins: [
        react(),
    ],
    server: {
        port: 3030,
        host: true,
        listen: true,
    },
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
}