import react from "@vitejs/plugin-react-swc";
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'html-transform',
            transformIndexHtml(html) {
                if (process.env.NODE_ENV === 'production') {
                    const csp = [
                        "default-src 'self'",
                        "script-src 'self'",
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
                        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
                        "img-src 'self' data: https:",
                        "connect-src 'self' " + (process.env.VITE_API_URL || 'http://localhost:3000'),
                        "frame-ancestors 'none'",
                        "base-uri 'self'",
                        "form-action 'self'",
                    ].join('; ');

                    return html.replace(
                        '<head>',
                        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">`
                    );
                }
                return html;
            },
        },
    ],
    server: {
        port: 3030,
        host: true,
    },
    // content: [
    //     "./index.html",
    //     "./src/**/*.{js,ts,jsx,tsx}",
    // ],
    // theme: {
    //     extend: {},
    // },
});