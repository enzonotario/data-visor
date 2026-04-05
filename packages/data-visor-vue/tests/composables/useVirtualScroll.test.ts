import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { ROW_HEIGHT, useVirtualScroll } from '../../src/composables/useVirtualScroll'
import { buildTree } from '../../src/utils/tree'

function makeNodes(count: number) {
  const data: Record<string, number> = {}
  for (let i = 0; i < count; i++) data[`key${i}`] = i
  return ref(buildTree(data).filter((n) => !n.isCollapsible))
}

describe('useVirtualScroll', () => {
  it('totalHeight equals nodes.length * ROW_HEIGHT', () => {
    const nodes = makeNodes(10)
    const { totalHeight } = useVirtualScroll(nodes)
    expect(totalHeight.value).toBe(nodes.value.length * ROW_HEIGHT)
  })

  it('visibleSlice covers all nodes when total fits in viewport', () => {
    const nodes = makeNodes(5)
    const { visibleSlice } = useVirtualScroll(nodes)
    expect(visibleSlice.value.length).toBe(nodes.value.length)
  })

  it('offsetY is 0 at initial scroll position', () => {
    const nodes = makeNodes(20)
    const { offsetY } = useVirtualScroll(nodes)
    expect(offsetY.value).toBe(0)
  })

  it('scrollToNode does nothing when containerRef is null', () => {
    const nodes = makeNodes(5)
    const { scrollToNode, containerRef } = useVirtualScroll(nodes)
    expect(containerRef.value).toBeNull()
    expect(() => scrollToNode(nodes.value[0].id)).not.toThrow()
  })

  it('scrollToNode does nothing for unknown id', () => {
    const nodes = makeNodes(5)
    const { scrollToNode } = useVirtualScroll(nodes)
    expect(() => scrollToNode('nonexistent')).not.toThrow()
  })

  it('scrollToNode scrolls up when node is above viewport', () => {
    const nodes = makeNodes(100)
    const { scrollToNode, containerRef } = useVirtualScroll(nodes)
    const el = document.createElement('div')
    el.scrollTop = 50 * ROW_HEIGHT
    Object.defineProperty(el, 'clientHeight', { value: 200 })
    containerRef.value = el
    scrollToNode(nodes.value[0].id)
    expect(el.scrollTop).toBe(0)
  })

  it('scrollToNode scrolls down when node is below viewport', () => {
    const nodes = makeNodes(100)
    const { scrollToNode, containerRef } = useVirtualScroll(nodes)
    const clientHeight = 200
    const el = document.createElement('div')
    el.scrollTop = 0
    Object.defineProperty(el, 'clientHeight', { value: clientHeight })
    containerRef.value = el
    const lastNode = nodes.value[nodes.value.length - 1]
    scrollToNode(lastNode.id)
    const lastIdx = nodes.value.findIndex((n) => n.id === lastNode.id)
    const expectedBottom = (lastIdx + 1) * ROW_HEIGHT
    expect(el.scrollTop).toBe(expectedBottom - clientHeight)
  })
})
