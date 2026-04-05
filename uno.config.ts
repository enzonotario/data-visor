import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      pg: {
        bg: 'var(--pg-bg)',
        fg: 'var(--pg-fg)',
        muted: 'var(--pg-muted)',
        accent: 'var(--pg-accent)',
        inputBg: 'var(--pg-input-bg)',
        inputBorder: 'var(--pg-input-border)',
        btnBg: 'var(--pg-btn-bg)',
        btnActiveBg: 'var(--pg-btn-active-bg)',
        btnActiveFg: 'var(--pg-btn-active-fg)',
      },
    },
  },
  shortcuts: {
    btn: 'px-2 py-1 rounded bg-pg-btnBg border border-pg-inputBorder text-pg-fg text-[11px] cursor-pointer hover:bg-pg-inputBorder transition-colors',
    'btn-active':
      'bg-pg-btnActiveBg border-pg-btnActiveBg text-pg-btnActiveFg hover:bg-pg-btnActiveBg',
    'input-base':
      'bg-pg-inputBg border border-pg-inputBorder rounded px-1 py-0.5 text-pg-fg text-[11px] outline-none focus:border-pg-accent',
  },
})
