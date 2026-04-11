import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DataVisorElement',
      fileName: 'data-visor-element',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', 'data-visor-vue'],
      output: {
        exports: 'named',
        assetFileNames: 'data-visor-element[extname]',
      },
    },
    sourcemap: true,
  },
})
