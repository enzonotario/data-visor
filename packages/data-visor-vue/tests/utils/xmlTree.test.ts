import { describe, expect, it } from 'vitest'
import { buildTree } from '../../src/utils/tree'
import { parseXml } from '../../src/utils/xmlTree'

describe('parseXml', () => {
  it('parses a simple element to an object keyed by element name', () => {
    const result = parseXml('<root><name>Alice</name></root>') as Record<string, unknown>
    expect(result.root).toBeDefined()
  })

  it('parses element attributes under @_ prefix', () => {
    const result = parseXml('<user id="1"><name>Alice</name></user>') as Record<string, unknown>
    const user = result.user as Record<string, unknown>
    expect(user['@_id']).toBe(1)
  })

  it('parses text content under #text key', () => {
    const result = parseXml('<root>hello</root>') as Record<string, unknown>
    expect(result.root).toBe('hello')
  })

  it('parses repeated sibling elements as an array', () => {
    const xml = '<items><item>a</item><item>b</item></items>'
    const result = parseXml(xml) as Record<string, unknown>
    const items = result.items as Record<string, unknown>
    expect(Array.isArray(items.item)).toBe(true)
    expect((items.item as unknown[]).length).toBe(2)
  })

  it('parses nested elements to correct depth', () => {
    const xml = '<a><b><c>deep</c></b></a>'
    const result = parseXml(xml) as Record<string, unknown>
    const a = result.a as Record<string, unknown>
    const b = a.b as Record<string, unknown>
    expect(b.c).toBe('deep')
  })
})

describe('buildTree from XML', () => {
  it('produces nodes from a simple XML document', () => {
    const nodes = buildTree(parseXml('<root><name>Alice</name></root>'))
    expect(nodes.length).toBeGreaterThan(1)
  })

  it('root node is collapsible', () => {
    const nodes = buildTree(parseXml('<root><a>1</a><b>2</b></root>'))
    expect(nodes[0].isCollapsible).toBe(true)
  })

  it('leaf text node is not collapsible', () => {
    const nodes = buildTree(parseXml('<root><name>Alice</name></root>'))
    const leaf = nodes.find((n) => n.value === 'Alice')
    expect(leaf?.isCollapsible).toBe(false)
  })
})
