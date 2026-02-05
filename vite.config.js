import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: '/billiard-trx/',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'Billiard TRX Management',
                short_name: 'BilliardTRX',
                description: 'Record inputs, track analytics, and distribute dividends.',
                theme_color: '#F3F1E7',
                background_color: '#F3F1E7',
                display: 'standalone',
                start_url: '.',
                icons: [
                    {
                        src: '/game.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/game.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
