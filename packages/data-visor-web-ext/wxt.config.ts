import { defineConfig } from 'wxt'
import { asciiContentScripts } from './vite-plugins/ascii-content-scripts'

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [asciiContentScripts()],
    build: {
      commonjsOptions: {
        include: [/data-visor-vue/, /node_modules/],
      },
    },
  }),
  manifest: {
    name: 'Data Visor',
    description: 'Tree and raw view for JSON, YAML, and XML documents',
    permissions: ['storage'],
  },
})
