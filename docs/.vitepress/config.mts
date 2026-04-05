import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Data Visor',
  description: 'Shiki-powered JSON/YAML/XML viewer for Vue',
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://data-visor.enzonotario.me/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://data-visor.enzonotario.me/og.png' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'https://data-visor.enzonotario.me//icon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: 'https://data-visor.enzonotario.me//icon.png' }],
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/vue/getting-started' },
      { text: 'Examples', link: '/vue/examples' },
      { text: 'Playground', link: '/playground' },
    ],
    sidebar: [
      {
        text: 'Vue component',
        items: [
          { text: 'Getting Started', link: '/vue/getting-started' },
          { text: 'Configuration', link: '/vue/configuration' },
          { text: 'Examples', link: '/vue/examples' },
        ],
      },
      {
        text: 'Web extension',
        items: [
          { text: 'Overview', link: '/web-ext/' },
          { text: 'Privacy Policy', link: '/web-ext/privacy-policy' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/enzonotario/data-visor' }],
    footer: {
      message:
        'Released under the <a href="https://github.com/enzonotario/vitepress-openapi/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2026-present <a href="https://enzonotario.me">Enzo Notario</a>',
    },
  },
  vite: {
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        'data-visor-vue': resolve(__dirname, '../../packages/data-visor-vue/src/index.ts'),
      },
    },
  },
})
