import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [vue(), UnoCSS(resolve(__dirname, 'uno.config.ts'))],
  resolve: {
    alias: {
      'data-visor-vue': resolve(__dirname, 'packages/data-visor-vue/src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
