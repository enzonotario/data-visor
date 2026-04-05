import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useSearch } from '../../src/composables/useSearch'
import { buildTree } from '../../src/utils/tree'

const data = {
  name: 'Alice',
  age: 30,
  address: { city: 'Madrid', zip: '28001' },
  tags: ['vue', 'typescript'],
}

function setup() {
  const nodes = ref(buildTree(data))
  return { nodes, ...useSearch(nodes) }
}

describe('useSearch', () => {
  it('matchIds is empty when query is empty', () => {
    const { matchIds } = setup()
    expect(matchIds.value).toEqual([])
  })

  it('finds matches by key', () => {
    const { query, matchIds } = setup()
    query.value = 'name'
    expect(matchIds.value.length).toBeGreaterThan(0)
    expect(matchIds.value).toContain('$.name')
  })

  it('finds matches by string value', () => {
    const { query, matchIds } = setup()
    query.value = 'Alice'
    expect(matchIds.value).toContain('$.name')
  })

  it('finds matches by numeric value', () => {
    const { query, matchIds } = setup()
    query.value = '30'
    expect(matchIds.value).toContain('$.age')
  })

  it('search is case-insensitive', () => {
    const { query, matchIds } = setup()
    query.value = 'alice'
    expect(matchIds.value).toContain('$.name')
  })

  it('finds by json path when query starts with $', () => {
    const { query, matchIds } = setup()
    query.value = '$.address'
    expect(matchIds.value.some((id) => id.startsWith('$.address'))).toBe(true)
  })

  it('hasMatches is false when no results', () => {
    const { query, hasMatches } = setup()
    query.value = 'nonexistent_xyz'
    expect(hasMatches.value).toBe(false)
  })

  it('hasMatches is true when there are results', () => {
    const { query, hasMatches } = setup()
    query.value = 'vue'
    expect(hasMatches.value).toBe(true)
  })

  it('activeMatchId is null when no matches', () => {
    const { activeMatchId } = setup()
    expect(activeMatchId.value).toBeNull()
  })

  it('activeMatchId points to first match initially', () => {
    const { query, matchIds, activeMatchId } = setup()
    query.value = 'a'
    expect(activeMatchId.value).toBe(matchIds.value[0])
  })

  it('nextMatch increments activeIndex with wrap-around', () => {
    const { query, matchIds, activeIndex, nextMatch } = setup()
    query.value = 'a'
    const total = matchIds.value.length
    for (let i = 0; i < total; i++) nextMatch()
    expect(activeIndex.value).toBe(0)
  })

  it('prevMatch decrements with wrap-around', () => {
    const { query, matchIds, activeIndex, prevMatch } = setup()
    query.value = 'a'
    prevMatch()
    expect(activeIndex.value).toBe(matchIds.value.length - 1)
  })

  it('clearSearch resets all state', () => {
    const { query, matchIds, activeIndex, clearSearch } = setup()
    query.value = 'Alice'
    clearSearch()
    expect(query.value).toBe('')
    expect(matchIds.value).toEqual([])
    expect(activeIndex.value).toBe(0)
  })

  it('isMatch returns true for matching node', () => {
    const { query, isMatch } = setup()
    query.value = 'Alice'
    expect(isMatch('$.name')).toBe(true)
  })

  it('isMatch returns false for non-matching node', () => {
    const { query, isMatch } = setup()
    query.value = 'Alice'
    expect(isMatch('$.age')).toBe(false)
  })

  it('isActiveMatch returns true only for active node', () => {
    const { query, matchIds, isActiveMatch } = setup()
    query.value = 'a'
    const first = matchIds.value[0]
    expect(isActiveMatch(first)).toBe(true)
  })
})
