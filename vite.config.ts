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
                        "script-src 'self' https://js.api.here.com 'unsafe-eval'",
                        "worker-src 'self' blob:",
                        "child-src 'self' blob:",
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://js.api.here.com",
                        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
                        "img-src 'self' data: https: blob:",
                        "connect-src 'self' blob: https://js.api.here.com https://geocode.search.hereapi.com https://revgeocode.search.hereapi.com https://vector.hereapi.com https://*.base.maps.ls.hereapi.com https://*.base.maps.api.here.com https://*.aerial.maps.ls.hereapi.com https://*.aerial.maps.api.here.com " + (process.env.VITE_API_URL || 'http://localhost:3000'),
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
    base: '/',
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