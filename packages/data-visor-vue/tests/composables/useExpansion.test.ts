import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useExpansion } from '../../src/composables/useExpansion'
import { buildTree } from '../../src/utils/tree'

const sampleJson = { a: { b: { c: 1 } }, d: [10, 20] }

function setup() {
  const nodes = ref(buildTree(sampleJson))
  const expansion = useExpansion(nodes)
  return { nodes, ...expansion }
}

describe('useExpansion', () => {
  it('starts with nothing expanded', () => {
    const { expandedIds } = setup()
    expect(expandedIds.value.size).toBe(0)
  })

  it('toggle expands a collapsible node', () => {
    const { toggle, isExpanded, nodes } = setup()
    const root = nodes.value[0]
    toggle(root.id)
    expect(isExpanded(root.id)).toBe(true)
  })

  it('toggle collapses an already-expanded node', () => {
    const { toggle, isExpanded, nodes } = setup()
    const root = nodes.value[0]
    toggle(root.id)
    toggle(root.id)
    expect(isExpanded(root.id)).toBe(false)
  })

  it('expandToDepth(1) expands only depth-0 collapsible nodes', () => {
    const { expandToDepth, expandedIds, nodes } = setup()
    expandToDepth(1)
    const expanded = [...expandedIds.value]
    const depths = expanded.map((id) => nodes.value.find((n) => n.id === id)!.depth)
    expect(depths.every((d) => d < 1)).toBe(true)
  })

  it('expandToDepth(2) expands nodes at depth 0 and 1', () => {
    const { expandToDepth, expandedIds, nodes } = setup()
    expandToDepth(2)
    for (const id of expandedIds.value) {
      const node = nodes.value.find((n) => n.id === id)!
      expect(node.depth).toBeLessThan(2)
    }
  })

  it('expandAll expands all collapsible nodes', () => {
    const { expandAll, expandedIds, nodes } = setup()
    expandAll()
    const collapsible = nodes.value.filter((n) => n.isCollapsible)
    expect(expandedIds.value.size).toBe(collapsible.length)
  })

  it('collapseAll empties expandedIds', () => {
    const { expandAll, collapseAll, expandedIds } = setup()
    expandAll()
    collapseAll()
    expect(expandedIds.value.size).toBe(0)
  })

  it('visibleNodes shows only root when nothing expanded', () => {
    const { visibleNodes } = setup()
    expect(visibleNodes.value).toHaveLength(1)
  })

  it('visibleNodes grows after toggle', () => {
    const { toggle, visibleNodes, nodes } = setup()
    toggle(nodes.value[0].id)
    expect(visibleNodes.value.length).toBeGreaterThan(1)
  })

  it('expandPath expands all ancestors of a path', () => {
    const { expandPath, isExpanded, nodes } = setup()
    const deepNode = nodes.value.find((n) => n.path === '$.a.b.c')!
    expandPath(deepNode.path, nodes.value)
    expect(isExpanded('$')).toBe(true)
    expect(isExpanded('$.a')).toBe(true)
    expect(isExpanded('$.a.b')).toBe(true)
  })

  it('expandPath does not expand the target node itself', () => {
    const { expandPath, isExpanded, nodes } = setup()
    expandPath('$.a', nodes.value)
    expect(isExpanded('$.a')).toBe(false)
  })
})
