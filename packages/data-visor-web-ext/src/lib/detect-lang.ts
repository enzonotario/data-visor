import type { ViewerLang } from 'data-visor-vue'

export function detectLangFromUrl(href: string): ViewerLang {
  try {
    const { pathname } = new URL(href)
    const last = (pathname.split('/').pop() ?? '').split('?')[0].toLowerCase()
    if (last.endsWith('.yaml') || last.endsWith('.yml')) return 'yaml'
    if (last.endsWith('.xml')) return 'xml'
    return 'json'
  } catch {
    return 'json'
  }
}
