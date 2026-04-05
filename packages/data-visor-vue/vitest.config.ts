import Vue from '@vitejs/plugin-vue'
import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [Vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    exclude: [...defaultExclude, '**/e2e/**'],
  },
})
