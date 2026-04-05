import { describe, expect, it } from 'vitest'
import { buildTree } from '../../src/utils/tree'
import { parseYaml } from '../../src/utils/yamlTree'

describe('parseYaml', () => {
  it('parses a simple mapping to an object', () => {
    const result = parseYaml('name: Alice\nage: 30')
    expect(result).toEqual({ name: 'Alice', age: 30 })
  })

  it('parses number scalars as JS numbers', () => {
    const result = parseYaml('count: 42') as Record<string, unknown>
    expect(typeof result.count).toBe('number')
    expect(result.count).toBe(42)
  })

  it('parses boolean scalars as JS booleans', () => {
    const result = parseYaml('active: true') as Record<string, unknown>
    expect(typeof result.active).toBe('boolean')
    expect(result.active).toBe(true)
  })

  it('parses null / ~ as null', () => {
    const result = parseYaml('value: ~') as Record<string, unknown>
    expect(result.value).toBeNull()
  })

  it('parses a sequence at root to an array', () => {
    const result = parseYaml('- one\n- two\n- three')
    expect(result).toEqual(['one', 'two', 'three'])
  })

  it('parses nested mapping', () => {
    const result = parseYaml('user:\n  name: Alice\n  age: 30') as Record<string, unknown>
    expect(result.user).toEqual({ name: 'Alice', age: 30 })
  })

  it('throws on invalid YAML', () => {
    expect(() => parseYaml('key: [unclosed')).toThrow()
  })

  it('throws on multi-document YAML', () => {
    expect(() => parseYaml('---\nfoo: 1\n---\nbar: 2')).toThrow(/multi-document/i)
  })
})

describe('buildTree from YAML', () => {
  it('produces correct node count for a simple mapping', () => {
    const nodes = buildTree(parseYaml('name: Alice\nage: 30'))
    // root, name, age, root_close
    expect(nodes).toHaveLength(4)
  })

  it('produces correct depth for nested structure', () => {
    const nodes = buildTree(parseYaml('user:\n  name: Alice'))
    // root, user, user.name, user_close, root_close
    const depths = nodes.map((n) => n.depth)
    expect(depths).toEqual([0, 1, 2, 1, 0])
  })

  it('produces correct types for scalars', () => {
    const nodes = buildTree(parseYaml('n: 42\nb: true\ns: hello'))
    const byKey = Object.fromEntries(
      nodes.filter((n) => n.key !== undefined).map((n) => [n.key, n.type]),
    )
    expect(byKey.n).toBe('number')
    expect(byKey.b).toBe('boolean')
    expect(byKey.s).toBe('string')
  })
})
