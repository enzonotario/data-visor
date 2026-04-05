import { useDark } from '@vueuse/core'
import { DataVisor } from 'data-visor-vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import Layout from './Layout.vue'
import { JSON_EXAMPLE, LANG_EXAMPLE, XML_EXAMPLE, YAML_EXAMPLE } from './utils/examples'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Playground', Playground)
    app.component('DataVisor', DataVisor)

    const isDark = useDark({
      storageKey: 'vitepress-theme-appearance',
    })
    app.config.globalProperties.$isDark = isDark

    app.config.globalProperties.$examples = {
      JSON: JSON_EXAMPLE,
      YAML: YAML_EXAMPLE,
      XML: XML_EXAMPLE,
      ALL: LANG_EXAMPLE,
    }
  },
} satisfies Theme
