import { describe, expect, it } from 'vitest'
import { buildPath, nodeAtPath, pathToSegments } from '../../src/utils/path'

describe('buildPath', () => {
  it('appends simple key with dot notation', () => {
    expect(buildPath('$', 'name')).toBe('$.name')
  })

  it('appends numeric index with bracket notation', () => {
    expect(buildPath('$', 0)).toBe('$[0]')
  })

  it('uses bracket notation for keys with special chars', () => {
    expect(buildPath('$', 'my-key')).toBe('$["my-key"]')
  })

  it('builds nested path', () => {
    expect(buildPath(buildPath('$', 'users'), 0)).toBe('$.users[0]')
  })
})

describe('pathToSegments', () => {
  it('parses dot notation', () => {
    expect(pathToSegments('$.name')).toEqual(['name'])
  })

  it('parses array index', () => {
    expect(pathToSegments('$[0]')).toEqual([0])
  })

  it('parses nested path', () => {
    expect(pathToSegments('$.users[0].name')).toEqual(['users', 0, 'name'])
  })

  it('parses bracket string notation', () => {
    expect(pathToSegments('$["my-key"]')).toEqual(['my-key'])
  })

  it('returns empty for root path', () => {
    expect(pathToSegments('$')).toEqual([])
  })
})

describe('nodeAtPath', () => {
  const data = { users: [{ name: 'Alice' }, { name: 'Bob' }], count: 2 }

  it('retrieves top-level key', () => {
    expect(nodeAtPath(data, '$.count')).toBe(2)
  })

  it('retrieves nested value', () => {
    expect(nodeAtPath(data, '$.users[0].name')).toBe('Alice')
  })

  it('returns undefined for nonexistent path', () => {
    expect(nodeAtPath(data, '$.missing')).toBeUndefined()
  })

  it('returns undefined when traversing through primitive', () => {
    expect(nodeAtPath(data, '$.count.foo')).toBeUndefined()
  })

  it('handles null root', () => {
    expect(nodeAtPath(null, '$.foo')).toBeUndefined()
  })
})
