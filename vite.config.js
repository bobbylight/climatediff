import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        eslint(),
        vuetify({ autoImport: true }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify('1.0.0'),
        __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
})
