import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    // Add this section to resolve react-native-web dependencies
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
        // Ensure that files with these extensions are resolved
        extensions: ['.web.jsx', '.web.js', '.jsx', '.js', '.json'],
    },

    // Keep your server proxy configuration
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
})