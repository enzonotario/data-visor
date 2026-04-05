import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: './src/index.ts',
  platform: 'neutral',
  fromVite: false,
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  css: {
    transformer: 'postcss',
    postcss: true,
  },
})
