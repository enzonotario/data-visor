import { type ComputedRef, type MaybeRefOrGetter, type Ref, ref, toValue, watch } from 'vue'
import type { ShikiTheme, TreeNode, ViewerLang } from '../types/tree'
import { themeKey, type UseShikiReturn } from './useShiki'

const LINE_MARKER = '<span class="line">'

/** Contenido interno de un `<span class="line">…</span>` balanceando spans anidados (Shiki). */
function extractNextLineInner(html: string, from: number): { inner: string; next: number } | null {
  const start = html.indexOf(LINE_MARKER, from)
  if (start === -1) return null
  let pos = start + LINE_MARKER.length
  let depth = 1
  while (pos < html.length && depth > 0) {
    const close = html.indexOf('</span>', pos)
    const open = html.indexOf('<span', pos)
    if (close === -1) break
    if (open !== -1 && open < close) {
      depth++
      const gt = html.indexOf('>', open)
      if (gt === -1) break
      pos = gt + 1
    } else {
      depth--
      if (depth === 0) {
        return { inner: html.slice(start + LINE_MARKER.length, close), next: close + 7 }
      }
      pos = close + 7
    }
  }
  return null
}

function extractShikiLines(html: string): string[] {
  const lines: string[] = []
  let i = 0
  while (i < html.length) {
    const hit = extractNextLineInner(html, i)
    if (!hit) break
    lines.push(hit.inner)
    i = hit.next
  }
  return lines
}

function stripLeadingIndent(html: string): string {
  return html.replace(/^(<span[^>]*>)\s+/, '$1')
}

/** Matches `buildTree` line indices (2-space indented JSON). */
function jsonSourceForHighlight(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

function sourceForHighlight(c: string, lang: ViewerLang): string {
  if (lang !== 'json') return c
  const trimmed = c.trimStart()
  if (!trimmed) return c
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return jsonSourceForHighlight(c)
  return c
}

export interface UseTokenMapReturn {
  tokenMap: Ref<Map<string, string>>
  themeBg: Ref<string>
  themeFg: Ref<string>
}

export function useTokenMap(
  source: Ref<string>,
  lang: Ref<ViewerLang>,
  nodes: ComputedRef<TreeNode[]>,
  shiki: UseShikiReturn,
  currentTheme: ComputedRef<ShikiTheme>,
  preloadThemes?: MaybeRefOrGetter<ShikiTheme[]>,
): UseTokenMapReturn {
  function extraThemes(): ShikiTheme[] {
    return preloadThemes ? [...toValue(preloadThemes)] : []
  }
  const tokenMap = ref<Map<string, string>>(new Map())
  const themeBg = ref('#1e1e2e')
  const themeFg = ref('#cdd6f4')

  function applyThemeColors(theme: ShikiTheme): void {
    const colors = shiki.getThemeColors(theme)
    if (colors) {
      themeBg.value = colors.bg
      themeFg.value = colors.fg
    }
  }

  function buildMap(c: string, theme: ShikiTheme): Map<string, string> {
    const map = new Map<string, string>()
    if (!shiki.isReady.value) return map
    if (lang.value !== 'json') return map
    const html = shiki.highlight(sourceForHighlight(c, lang.value), theme, lang.value)
    const lines = extractShikiLines(html)
    for (const node of nodes.value) {
      const raw = lines[node.sourceLine] ?? ''
      map.set(node.id, stripLeadingIndent(raw))
    }
    return map
  }

  async function loadHighlighterAndRebuild(): Promise<void> {
    await shiki.load(currentTheme.value, lang.value, extraThemes())
    applyThemeColors(currentTheme.value)
    tokenMap.value = buildMap(source.value, currentTheme.value)
  }

  async function tryLoadHighlighterAndRebuild(): Promise<void> {
    try {
      await loadHighlighterAndRebuild()
    } catch {
      void 0
    }
  }

  function tryRebuildTokenMap(): void {
    if (!shiki.isReady.value) return
    try {
      tokenMap.value = buildMap(source.value, currentTheme.value)
    } catch {
      void 0
    }
  }

  watch(currentTheme, () => void tryLoadHighlighterAndRebuild())
  watch(source, tryRebuildTokenMap)
  watch(lang, () => void tryLoadHighlighterAndRebuild())

  if (preloadThemes) {
    watch(
      () => toValue(preloadThemes).map(themeKey).join('|'),
      () => void tryLoadHighlighterAndRebuild(),
    )
  }

  watch(
    () => shiki.isReady.value,
    (ready) => {
      if (ready) tryRebuildTokenMap()
    },
  )

  void tryLoadHighlighterAndRebuild()

  return { tokenMap, themeBg, themeFg }
}
