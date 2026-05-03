const EXT_RE = /\.(json|yaml|yml|xml)$/i

export const MAX_TREE_CHARS = 700_000

export const BROWSER_NATIVE_HASH = '#raw'

export function shouldActivateForUrl(href: string): boolean {
  try {
    const { pathname } = new URL(href)
    const last = pathname.split('/').pop() ?? ''
    const base = last.split('?')[0] ?? ''
    return EXT_RE.test(base)
  } catch {
    return false
  }
}

export function wantsBrowserNativeView(href: string): boolean {
  try {
    return new URL(href).hash === BROWSER_NATIVE_HASH
  } catch {
    return false
  }
}

function documentMime(doc: Pick<Document, 'contentType'>): string {
  return (doc.contentType ?? '').split(';')[0].trim().toLowerCase()
}

/** MIME types that indicate a raw structured document (not HTML) even without a file extension in the URL. */
function isStructuredDataMime(mime: string): boolean {
  if (!mime) return false
  // Web pages served as XHTML match `application/*+xml` but must stay in the browser (like HTML).
  if (mime === 'application/xhtml+xml') return false
  if (
    mime === 'application/json' ||
    mime === 'application/xml' ||
    mime === 'text/xml' ||
    mime === 'application/yaml' ||
    mime === 'text/yaml' ||
    mime === 'text/x-yaml' ||
    mime === 'application/x-yaml'
  ) {
    return true
  }
  if (mime.startsWith('application/') && (mime.endsWith('+json') || mime.endsWith('+xml'))) {
    return true
  }
  return false
}

export function shouldActivateForDocument(
  href: string,
  doc: Pick<Document, 'contentType'>,
): boolean {
  const mime = documentMime(doc)
  if (mime === 'text/html') return false

  if (shouldActivateForUrl(href)) return true

  return isStructuredDataMime(mime)
}
