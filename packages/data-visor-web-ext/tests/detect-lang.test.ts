import { describe, expect, it } from 'vitest'
import { detectLangFromPage, detectLangFromUrl } from '@/lib/detect-lang'

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

const doc = (contentType: string): Pick<Document, 'contentType'> => ({ contentType })

describe('detectLangFromPage', () => {
  it('uses the path when an extension is present', () => {
    expect(detectLangFromPage('https://x/a.yaml', doc('application/json'))).toBe('yaml')
  })

  it('infers from MIME when the path has no extension', () => {
    expect(detectLangFromPage('https://x/v1/r', doc('application/json'))).toBe('json')
    expect(detectLangFromPage('https://x/v1/r', doc('application/xml'))).toBe('xml')
    expect(detectLangFromPage('https://x/v1/r', doc('text/yaml'))).toBe('yaml')
  })
})
