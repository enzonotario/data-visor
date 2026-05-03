import type { ViewerLang } from 'data-visor-vue'

function langFromPathname(pathname: string): ViewerLang | null {
  const last = (pathname.split('/').pop() ?? '').split('?')[0].toLowerCase()
  if (last.endsWith('.yaml') || last.endsWith('.yml')) return 'yaml'
  if (last.endsWith('.xml')) return 'xml'
  if (last.endsWith('.json')) return 'json'
  return null
}

function langFromMime(raw: string): ViewerLang | null {
  const mime = raw.split(';')[0].trim().toLowerCase()
  if (!mime) return null
  if (
    mime === 'application/xml' ||
    mime === 'text/xml' ||
    (mime.startsWith('application/') && mime.endsWith('+xml'))
  ) {
    return 'xml'
  }
  if (mime.includes('yaml') || mime === 'application/x-yaml') {
    return 'yaml'
  }
  if (mime === 'application/json' || (mime.startsWith('application/') && mime.endsWith('+json'))) {
    return 'json'
  }
  return null
}

export function detectLangFromUrl(href: string): ViewerLang {
  try {
    return langFromPathname(new URL(href).pathname) ?? 'json'
  } catch {
    return 'json'
  }
}

/** Prefer the path extension; if missing (API URLs), infer from `document.contentType`. */
export function detectLangFromPage(href: string, doc: Pick<Document, 'contentType'>): ViewerLang {
  try {
    const fromPath = langFromPathname(new URL(href).pathname)
    if (fromPath) return fromPath
    return langFromMime(doc.contentType ?? '') ?? 'json'
  } catch {
    return 'json'
  }
}
