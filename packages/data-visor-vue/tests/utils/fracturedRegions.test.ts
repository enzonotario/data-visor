import { Formatter, FracturedJsonOptions } from 'fracturedjsonjs'
import { describe, expect, it } from 'vitest'
import {
  buildFracturedRegions,
  deepestNodeForLine,
  getParentPath,
} from '../../src/utils/fracturedRegions'
import { buildTree } from '../../src/utils/tree'

describe('fracturedRegions', () => {
  it('getParentPath maps JSON paths', () => {
    expect(getParentPath('$.a')).toBe('$')
    expect(getParentPath('$.items[0]')).toBe('$.items')
  })

  it('buildFracturedRegions aligns collapsible nodes with fractured text', () => {
    const raw = JSON.stringify({ a: 1, b: { c: 2 } })
    const formatter = new Formatter()
    formatter.Options = new FracturedJsonOptions()
    const full = formatter.Reformat(raw)
    const tree = JSON.parse(raw)
    const nodes = buildTree(tree)
    const regions = buildFracturedRegions(full, nodes, formatter)
    const paths = new Set(regions.map((r) => r.node.path))
    expect(paths.has('$')).toBe(true)
    expect(paths.has('$.b')).toBe(true)
    const inner = regions.find((r) => r.node.path === '$.b')
    expect(inner).toBeDefined()
    expect(deepestNodeForLine(inner!.startLine, regions)?.path).toBe('$.b')
  })
})
