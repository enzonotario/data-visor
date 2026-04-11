import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import { useTree } from '../../src/composables/useTree'

describe('useTree — JSON', () => {
  it('parses a simple object', () => {
    const content = ref('{"name":"Alice","age":30}')
    const lang = ref<'json'>('json')
    const { nodes, parseError } = useTree(content, lang)
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })

  it('exposes parseError on invalid JSON', () => {
    const content = ref('{ invalid }')
    const lang = ref<'json'>('json')
    const { nodes, parseError } = useTree(content, lang)
    void nodes.value // trigger lazy computed so parseError side-effect runs
    expect(parseError.value).toMatch(/JSON parse error/)
    expect(nodes.value).toEqual([])
  })

  it('updates nodes reactively on content change', () => {
    const content = ref('{"a":1}')
    const lang = ref<'json'>('json')
    const { nodes, parseError } = useTree(content, lang)
    expect(nodes.value.length).toBeGreaterThan(0)
    content.value = '{"a":1,"b":2}'
    expect(nodes.value.length).toBeGreaterThan(0)
    expect(parseError.value).toBeNull()
  })

  it('nodeMap is keyed by node id', () => {
    const content = ref('{"x":42}')
    const lang = ref<'json'>('json')
    const { nodes, nodeMap } = useTree(content, lang)
    for (const node of nodes.value) {
      expect(nodeMap.value.get(node.id)).toBe(node)
    }
  })

  it('clears parseError when content becomes valid', () => {
    const content = ref('bad json')
    const lang = ref<'json'>('json')
    const { nodes, parseError } = useTree(content, lang)
    void nodes.value
    expect(parseError.value).not.toBeNull()
    content.value = '{"ok":true}'
    void nodes.value
    expect(parseError.value).toBeNull()
  })
})

describe('useTree — YAML', () => {
  it('parses valid YAML', () => {
    const content = ref('name: Alice\nage: 30')
    const lang = ref<'yaml'>('yaml')
    const { nodes, parseError } = useTree(content, lang)
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })

  it('parses minified one-line YAML (JSON syntax is valid YAML 1.2)', () => {
    const content = ref('{"a":1,"b":[2,3]}')
    const lang = ref<'yaml'>('yaml')
    const { nodes, parseError } = useTree(content, lang)
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })

  it('exposes parseError on invalid YAML', () => {
    const content = ref('key: [unclosed')
    const lang = ref<'yaml'>('yaml')
    const { nodes, parseError } = useTree(content, lang)
    void nodes.value
    expect(parseError.value).toMatch(/YAML parse error/)
  })
})

describe('useTree — XML', () => {
  it('parses valid XML', () => {
    const content = ref('<root><name>Alice</name></root>')
    const lang = ref<'xml'>('xml')
    const { nodes, parseError } = useTree(content, lang)
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })

  it('parses minified XML on one line', () => {
    const content = ref('<?xml version="1.0" encoding="UTF-8"?><root><name>Alice</name></root>')
    const lang = ref<'xml'>('xml')
    const { nodes, parseError } = useTree(content, lang)
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })

  it('exposes parseError on invalid XML', () => {
    const content = ref('<unclosed')
    const lang = ref<'xml'>('xml')
    const { nodes, parseError } = useTree(content, lang)
    void nodes.value
    expect(parseError.value).toMatch(/XML parse error/)
  })
})

describe('useTree — lang switch', () => {
  it('re-parses when lang changes from json to yaml', () => {
    const content = ref('name: Alice')
    const lang = ref<'json' | 'yaml'>('json')
    const { parseError, nodes } = useTree(
      content as unknown as ReturnType<typeof ref<string>>,
      lang as unknown as ReturnType<typeof ref>,
    )
    // Trigger computed evaluation (parseError is set as side-effect inside computed)
    void nodes.value
    expect(parseError.value).not.toBeNull()
    lang.value = 'yaml'
    void nodes.value
    expect(parseError.value).toBeNull()
    expect(nodes.value.length).toBeGreaterThan(0)
  })
})
