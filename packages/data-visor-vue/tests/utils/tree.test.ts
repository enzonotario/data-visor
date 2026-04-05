import { describe, expect, it } from 'vitest'
import { buildTree } from '../../src/utils/tree'

describe('buildTree', () => {
  it('handles empty object', () => {
    const nodes = buildTree({})
    expect(nodes).toHaveLength(1)
    expect(nodes[0].type).toBe('object')
    expect(nodes[0].childCount).toBe(0)
    expect(nodes[0].isCollapsible).toBe(false)
  })

  it('handles empty array', () => {
    const nodes = buildTree([])
    expect(nodes).toHaveLength(1)
    expect(nodes[0].type).toBe('array')
    expect(nodes[0].childCount).toBe(0)
    expect(nodes[0].isCollapsible).toBe(false)
  })

  it('handles null at root', () => {
    const nodes = buildTree(null)
    expect(nodes).toHaveLength(1)
    expect(nodes[0].type).toBe('null')
    expect(nodes[0].isCollapsible).toBe(false)
  })

  it('handles string at root', () => {
    const nodes = buildTree('hello')
    expect(nodes[0].type).toBe('string')
    expect(nodes[0].childCount).toBe(0)
  })

  it('handles number at root', () => {
    expect(buildTree(42)[0].type).toBe('number')
  })

  it('handles boolean at root', () => {
    expect(buildTree(false)[0].type).toBe('boolean')
  })

  it('flattens nested object — correct node count', () => {
    // { a: 1, b: { c: 2 } }
    // nodes: root, a, b, b.c, b_close, root_close
    expect(buildTree({ a: 1, b: { c: 2 } })).toHaveLength(6)
  })

  it('assigns correct depth', () => {
    // { a: { b: 1 } }
    // nodes: root(0), a(1), a.b(2), a_close(1), root_close(0)
    const depths = buildTree({ a: { b: 1 } }).map((n) => n.depth)
    expect(depths).toEqual([0, 1, 2, 1, 0])
  })

  it('assigns correct path for object keys', () => {
    expect(buildTree({ name: 'Alice' })[1].path).toBe('$.name')
  })

  it('assigns correct path for array indices', () => {
    const nodes = buildTree([10, 20])
    expect(nodes[1].path).toBe('$[0]')
    expect(nodes[2].path).toBe('$[1]')
  })

  it('assigns correct key for object children', () => {
    expect(buildTree({ x: 1 })[1].key).toBe('x')
  })

  it('assigns correct key for array children', () => {
    expect(buildTree([99])[1].key).toBe(0)
  })

  it('root node has undefined key', () => {
    expect(buildTree({})[0].key).toBeUndefined()
  })

  it('childCount correct for object', () => {
    expect(buildTree({ a: 1, b: 2, c: 3 })[0].childCount).toBe(3)
  })

  it('childCount correct for array', () => {
    expect(buildTree([1, 2])[0].childCount).toBe(2)
  })

  it('IDs are stable across two calls with same input', () => {
    const a = buildTree({ name: 'test', items: [1, 2] })
    const b = buildTree({ name: 'test', items: [1, 2] })
    expect(a.map((n) => n.id)).toEqual(b.map((n) => n.id))
  })

  it('root node sourceLine is 0', () => {
    expect(buildTree({ a: 1 })[0].sourceLine).toBe(0)
  })

  it('first child sourceLine is 1 for non-empty object', () => {
    const nodes = buildTree({ a: 1, b: 2 })
    expect(nodes[1].sourceLine).toBe(1)
    expect(nodes[2].sourceLine).toBe(2)
  })

  it('sourceLine accounts for closing brackets of nested objects', () => {
    // { "a": [1, 2], "b": 3 }
    // line 0: {
    // line 1:   "a": [
    // line 2:     1,
    // line 3:     2
    // line 4:   ],
    // line 5:   "b": 3
    // line 6: }
    const nodes = buildTree({ a: [1, 2], b: 3 })
    const bNode = nodes.find((n) => n.key === 'b')!
    expect(bNode.sourceLine).toBe(5)
  })

  it('sourceLine for nested object children', () => {
    // line 0: {
    // line 1:   "a": {
    // line 2:     "b": 1
    // line 3:   }
    // line 4: }
    const nodes = buildTree({ a: { b: 1 } })
    const aNode = nodes.find((n) => n.key === 'a')!
    const bNode = nodes.find((n) => n.key === 'b')!
    expect(aNode.sourceLine).toBe(1)
    expect(bNode.sourceLine).toBe(2)
  })
})
