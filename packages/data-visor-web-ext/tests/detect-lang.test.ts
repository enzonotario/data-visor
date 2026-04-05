import { describe, expect, it } from 'vitest'
import { detectLangFromUrl } from '@/lib/detect-lang'

describe('detectLangFromUrl', () => {
  it('detects yaml and yml', () => {
    expect(detectLangFromUrl('https://x/a.yaml')).toBe('yaml')
    expect(detectLangFromUrl('https://x/a.yml')).toBe('yaml')
  })

  it('detects xml', () => {
    expect(detectLangFromUrl('https://x/a.xml')).toBe('xml')
  })

  it('defaults to json', () => {
    expect(detectLangFromUrl('https://x/a.json')).toBe('json')
    expect(detectLangFromUrl('https://x/unknown')).toBe('json')
  })
})
