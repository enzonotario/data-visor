import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { WxtVitest } from 'wxt/testing'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [WxtVitest(), vue()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      'data-visor-vue': path.resolve(root, '../data-visor-vue/src/index.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
