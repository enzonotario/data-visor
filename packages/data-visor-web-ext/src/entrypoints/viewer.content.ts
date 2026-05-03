import { createApp } from 'vue'
import '@/assets/viewer-shell.css'
import 'data-visor-vue/style.css'
import ViewerApp from '@/components/ViewerApp.vue'
import { uiColorMode } from '@/lib/color-mode-storage'
import { detectLangFromPage } from '@/lib/detect-lang'
import { extractPageText } from '@/lib/extract-text'
import { VIEWER_MATCH_PATTERNS } from '@/lib/match-patterns'
import { shikiDarkSyntaxTheme, shikiLightSyntaxTheme } from '@/lib/shiki-theme-storage'
import { normalizeDarkSyntaxTheme, normalizeLightSyntaxTheme } from '@/lib/shiki-theme-utils'
import {
  MAX_TREE_CHARS,
  shouldActivateForDocument,
  wantsBrowserNativeView,
} from '@/lib/should-activate'

function takeoverDocument(): HTMLElement {
  const html = document.documentElement
  html.setAttribute('data-dv-ext', '1')
  const head = document.head
  head.replaceChildren()
  const charset = document.createElement('meta')
  charset.setAttribute('charset', 'utf-8')
  head.appendChild(charset)
  const title = document.createElement('title')
  title.textContent = 'Data Visor'
  head.appendChild(title)

  const body = document.body
  body.replaceChildren()
  body.removeAttribute('style')

  const root = document.createElement('div')
  root.id = 'dv-ext-root'
  body.appendChild(root)
  return root
}

export default defineContentScript({
  matches: VIEWER_MATCH_PATTERNS,
  runAt: 'document_end',
  allFrames: false,
  async main() {
    if (!shouldActivateForDocument(location.href, document)) return
    if (wantsBrowserNativeView(location.href)) return
    const fullText = extractPageText(document)
    if (fullText.length > MAX_TREE_CHARS) return
    const lang = detectLangFromPage(location.href, document)
    const [initialColorMode, rawDarkSyntax, rawLightSyntax] = await Promise.all([
      uiColorMode.getValue(),
      shikiDarkSyntaxTheme.getValue(),
      shikiLightSyntaxTheme.getValue(),
    ])
    const initialDarkSyntaxTheme = normalizeDarkSyntaxTheme(rawDarkSyntax)
    const initialLightSyntaxTheme = normalizeLightSyntaxTheme(rawLightSyntax)
    const root = takeoverDocument()
    const app = createApp(ViewerApp, {
      fullText,
      lang,
      href: location.href,
      initialColorMode,
      initialDarkSyntaxTheme,
      initialLightSyntaxTheme,
    })
    app.mount(root)
  },
})
