import { describe, expect, it } from 'vitest'
import {
  shouldActivateForDocument,
  shouldActivateForUrl,
  wantsBrowserNativeView,
} from '@/lib/should-activate'

describe('shouldActivateForUrl', () => {
  it('accepts json path', () => {
    expect(shouldActivateForUrl('https://ex.com/api/v1/data.json')).toBe(true)
  })

  it('accepts yaml and yml', () => {
    expect(shouldActivateForUrl('https://ex.com/cfg.yaml')).toBe(true)
    expect(shouldActivateForUrl('https://ex.com/cfg.YML')).toBe(true)
  })

  it('accepts xml', () => {
    expect(shouldActivateForUrl('https://ex.com/a/b.xml')).toBe(true)
  })

  it('rejects other extensions', () => {
    expect(shouldActivateForUrl('https://ex.com/page.html')).toBe(false)
    expect(shouldActivateForUrl('https://ex.com/file.json5')).toBe(false)
  })

  it('handles query on filename', () => {
    expect(shouldActivateForUrl('https://ex.com/x.json?token=1')).toBe(true)
  })
})

describe('shouldActivateForDocument', () => {
  const doc = (contentType: string): Pick<Document, 'contentType'> => ({ contentType })

  it('allows raw json/yaml mime types', () => {
    expect(shouldActivateForDocument('https://ex.com/a.json', doc('application/json'))).toBe(true)
    expect(shouldActivateForDocument('https://ex.com/a.yml', doc('text/plain'))).toBe(true)
    expect(
      shouldActivateForDocument('https://ex.com/a.yaml', doc('text/yaml; charset=utf-8')),
    ).toBe(true)
  })

  it('rejects GitHub-style HTML shell despite .yml in path', () => {
    const href = 'https://github.com/enzonotario/esjs-argentina-datos/actions/workflows/senado.yml'
    expect(shouldActivateForDocument(href, doc('text/html'))).toBe(false)
    expect(shouldActivateForDocument(href, doc('text/html; charset=utf-8'))).toBe(false)
  })

  it('allows empty contentType (e.g. file://) when URL matches', () => {
    expect(shouldActivateForDocument('file:///tmp/x.json', doc(''))).toBe(true)
  })

  it('rejects non-matching URLs regardless of mime', () => {
    expect(shouldActivateForDocument('https://ex.com/page.html', doc('text/plain'))).toBe(false)
  })

  it('activates extensionless API URLs when the document MIME is structured data', () => {
    const href = 'https://api.argentinadatos.com/v1/finanzas/creditos/hipotecariosUva/'
    expect(shouldActivateForDocument(href, doc('application/json'))).toBe(true)
    expect(shouldActivateForDocument(href, doc('application/json; charset=utf-8'))).toBe(true)
  })

  it('does not activate extensionless URLs without a structured MIME', () => {
    expect(
      shouldActivateForDocument('https://ex.com/v1/resource', doc('text/plain')),
    ).toBe(false)
  })
})

describe('wantsBrowserNativeView', () => {
  it('is true for #raw', () => {
    expect(wantsBrowserNativeView('https://ex.com/a.yaml#raw')).toBe(true)
  })

  it('is false without #raw', () => {
    expect(wantsBrowserNativeView('https://ex.com/a.json')).toBe(false)
    expect(wantsBrowserNativeView('https://ex.com/a.json#other')).toBe(false)
  })
})
