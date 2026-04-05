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
