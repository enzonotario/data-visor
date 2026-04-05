import { type BundledLanguage, type BundledTheme, createHighlighter } from 'shiki'
import { type Ref, ref, shallowRef } from 'vue'
import type { ShikiTheme, ViewerLang } from '../types/tree'

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>

let _instance: Highlighter | null = null
let _loadedThemes = new Set<string>()
let _loadedLangs = new Set<string>()
let _opChain: Promise<unknown> = Promise.resolve()

const VIEWER_LANGS: BundledLanguage[] = ['json', 'yaml', 'xml']
const BOOTSTRAP_THEMES: BundledTheme[] = ['github-dark', 'github-light']

function enqueueShiki<T>(fn: () => Promise<T>): Promise<T> {
  const next = _opChain.then(fn)
  _opChain = next.then(
    () => undefined,
    () => undefined,
  )
  return next
}

function dedupeThemes(themes: ShikiTheme[]): ShikiTheme[] {
  const seen = new Set<string>()
  const out: ShikiTheme[] = []
  for (const t of themes) {
    const k = themeKey(t)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(t)
  }
  return out
}

/**
 * Returns a stable string key for any ShikiTheme.
 * Built-in themes use the string name directly.
 * Custom theme objects use their `name` property (required by the TextMate spec).
 */
export function themeKey(theme: ShikiTheme): string {
  if (typeof theme === 'string') return theme
  return (theme as { name?: string }).name ?? '__unnamed_custom_theme__'
}

async function getHighlighter(
  theme: ShikiTheme,
  lang: ViewerLang,
  preloadThemes: ShikiTheme[],
): Promise<Highlighter> {
  return enqueueShiki(async () => {
    if (!_instance) {
      _instance = await createHighlighter({
        langs: VIEWER_LANGS,
        themes: BOOTSTRAP_THEMES,
      })
      for (const t of BOOTSTRAP_THEMES) _loadedThemes.add(t)
      for (const l of VIEWER_LANGS) _loadedLangs.add(l)
    }
    for (const t of dedupeThemes([theme, ...preloadThemes])) {
      const k = themeKey(t)
      if (!_loadedThemes.has(k)) {
        await _instance.loadTheme(t as BundledTheme)
        _loadedThemes.add(k)
      }
    }
    if (!_loadedLangs.has(lang)) {
      await _instance.loadLanguage(lang as BundledLanguage)
      _loadedLangs.add(lang)
    }
    return _instance
  })
}

export interface ThemeColors {
  bg: string
  fg: string
}

export interface UseShikiReturn {
  highlighter: ReturnType<typeof shallowRef<Highlighter | null>>
  isReady: Ref<boolean>
  highlight: (code: string, theme: ShikiTheme, lang: ViewerLang) => string
  load: (theme: ShikiTheme, lang: ViewerLang, preloadThemes?: ShikiTheme[]) => Promise<void>
  getThemeColors: (theme: ShikiTheme) => ThemeColors | null
}

export function useShiki(): UseShikiReturn {
  const highlighter = shallowRef<Highlighter | null>(null)
  const isReady = ref(false)

  async function load(
    theme: ShikiTheme,
    lang: ViewerLang,
    preloadThemes: ShikiTheme[] = [],
  ): Promise<void> {
    isReady.value = false
    highlighter.value = await getHighlighter(theme, lang, preloadThemes)
    isReady.value = true
  }

  function highlight(code: string, theme: ShikiTheme, lang: ViewerLang): string {
    if (!highlighter.value) return escapeHtml(code)
    try {
      return highlighter.value.codeToHtml(code, {
        lang: lang as BundledLanguage,
        theme: theme as BundledTheme,
      })
    } catch {
      return escapeHtml(code)
    }
  }

  function getThemeColors(theme: ShikiTheme): ThemeColors | null {
    if (!highlighter.value) return null
    try {
      const key =
        typeof theme === 'string'
          ? (theme as BundledTheme)
          : ((theme as { name?: string }).name ?? '')
      const t = highlighter.value.getTheme(key as BundledTheme)
      return { bg: t.bg ?? '#1e1e2e', fg: t.fg ?? '#cdd6f4' }
    } catch {
      return null
    }
  }

  return { highlighter, isReady, highlight, load, getThemeColors }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function resetShikiSingleton(): void {
  _instance = null
  _loadedThemes = new Set()
  _loadedLangs = new Set()
  _opChain = Promise.resolve()
}
