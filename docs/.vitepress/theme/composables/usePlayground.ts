import type { ShikiTheme, ViewerDisplayMode, ViewerLang } from 'data-visor-vue'
import { ref } from 'vue'
import { JSON_EXAMPLE, LANG_EXAMPLE } from '../utils/examples'

export function usePlayground() {
  const lang = ref<ViewerLang>('json')
  const viewerMode = ref<ViewerDisplayMode>('tree')
  const showLineNumbers = ref(true)
  const showToolbar = ref(true)
  const showBreadcrumb = ref(true)
  const initialDepth = ref(2)
  const darkTheme = ref<ShikiTheme>('github-dark')
  const lightTheme = ref<ShikiTheme>('github-light')
  const currentContent = ref<string>(JSON_EXAMPLE)

  function onLangChange(newLang: ViewerLang) {
    lang.value = newLang
    currentContent.value = LANG_EXAMPLE[newLang]
  }

  return {
    lang,
    viewerMode,
    showLineNumbers,
    showToolbar,
    showBreadcrumb,
    initialDepth,
    darkTheme,
    lightTheme,
    currentContent,
    onLangChange,
  }
}
