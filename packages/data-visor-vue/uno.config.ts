import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{vue,ts,tsx}'],
  },
  presets: [presetUno()],
  transformers: [transformerDirectives()],
})
