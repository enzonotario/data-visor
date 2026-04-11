import { describe, expect, it } from 'vitest'
import { serializeMinified } from '../../src/utils/serializeMinified'

describe('serializeMinified', () => {
  it('minifies JSON', () => {
    expect(serializeMinified('{\n  "a": 1\n}', 'json')).toBe('{"a":1}')
  })

  it('returns null on invalid JSON', () => {
    expect(serializeMinified('{', 'json')).toBeNull()
  })

  it('minifies YAML via JSON serialization of parsed value', () => {
    expect(serializeMinified('a: 1', 'yaml')).toBe('{"a":1}')
  })

  it('collapses insignificant whitespace in XML', () => {
    const raw = `<?xml version="1.0"?>
<root>
  <a>1</a>
</root>`
    expect(serializeMinified(raw, 'xml')).toBe('<?xml version="1.0"?><root><a>1</a></root>')
  })
})
