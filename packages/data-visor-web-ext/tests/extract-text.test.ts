import { describe, expect, it } from 'vitest'
import { extractPageText } from '@/lib/extract-text'

describe('extractPageText', () => {
  it('prefers pre content', () => {
    const doc = document.implementation.createHTMLDocument('')
    doc.body.innerHTML = '<pre>{"a":1}</pre>'
    expect(extractPageText(doc)).toBe('{"a":1}')
  })

  it('falls back to body innerText', () => {
    const doc = document.implementation.createHTMLDocument('')
    doc.body.textContent = 'hello'
    expect(extractPageText(doc)).toBe('hello')
  })

  it('normalizes CRLF in pre', () => {
    const doc = document.implementation.createHTMLDocument('')
    doc.body.innerHTML = '<pre>a\r\nb</pre>'
    expect(extractPageText(doc)).toBe('a\nb')
  })
})
