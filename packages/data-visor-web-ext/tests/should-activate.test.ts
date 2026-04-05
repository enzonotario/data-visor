import { describe, expect, it } from 'vitest'
import { shouldActivateForUrl, wantsBrowserNativeView } from '@/lib/should-activate'

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

describe('wantsBrowserNativeView', () => {
  it('is true for #raw', () => {
    expect(wantsBrowserNativeView('https://ex.com/a.yaml#raw')).toBe(true)
  })

  it('is false without #raw', () => {
    expect(wantsBrowserNativeView('https://ex.com/a.json')).toBe(false)
    expect(wantsBrowserNativeView('https://ex.com/a.json#other')).toBe(false)
  })
})
