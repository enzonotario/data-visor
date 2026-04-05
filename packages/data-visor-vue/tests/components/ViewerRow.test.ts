import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { ViewerContext } from '../../src/components/DataVisor/injectionKey'
import { VIEWER_KEY } from '../../src/components/DataVisor/injectionKey'
import NodeToolbar from '../../src/components/DataVisor/NodeToolbar.vue'
import NodeValue from '../../src/components/DataVisor/NodeValue.vue'
import ViewerRow from '../../src/components/DataVisor/ViewerRow.vue'
import type { TreeNode } from '../../src/types/tree'

function makeNode(overrides: Partial<TreeNode> = {}): TreeNode {
  return {
    id: '$.name',
    type: 'string',
    key: 'name',
    value: 'Alice',
    depth: 1,
    path: '$.name',
    childCount: 0,
    isCollapsible: false,
    sourceLine: 1,
    ...overrides,
  }
}

function makeCtx(overrides: Partial<ViewerContext> = {}): ViewerContext {
  return {
    expansion: {
      isExpanded: () => false,
      toggle: vi.fn(),
    },
    search: {
      isMatch: () => false,
      isActiveMatch: () => false,
    },
    tokenMap: ref(new Map()),
    copiedNodePath: ref(null),
    lang: ref('json'),
    ...overrides,
  }
}

function mountRow(node: TreeNode, ctx = makeCtx()) {
  return mount(ViewerRow, {
    props: { node, showLineNumbers: true, lineNumber: 1 },
    global: {
      components: {
        NodeValue,
        NodeToolbar,
      },
      plugins: [
        {
          install(app) {
            app.provide(VIEWER_KEY, ctx)
          },
        },
      ],
    },
  })
}

describe('ViewerRow', () => {
  it('shows the node key in fallback mode', () => {
    const wrapper = mountRow(makeNode())
    expect(wrapper.text()).toContain('name')
  })

  it('shows line number when showLineNumbers is true', () => {
    const wrapper = mountRow(makeNode())
    expect(wrapper.find('.dv-row__line-number').text()).toBe('1')
  })

  it('applies correct indent width for depth', () => {
    const wrapper = mountRow(makeNode({ depth: 3 }))
    const indent = wrapper.find('.dv-row__indent')
    expect(indent.attributes('style')).toContain('48px')
  })

  it('shows toggle button when node is collapsible', () => {
    const node = makeNode({ isCollapsible: true, type: 'object', childCount: 2 })
    const wrapper = mountRow(node)
    expect(wrapper.find('.dv-row__toggle').exists()).toBe(true)
  })

  it('shows ▶ icon when collapsed', () => {
    const node = makeNode({ isCollapsible: true, type: 'object', childCount: 1 })
    const ctx = makeCtx({ expansion: { isExpanded: () => false, toggle: vi.fn() } })
    const wrapper = mountRow(node, ctx)
    expect(wrapper.find('.dv-ico--chevron-right').exists()).toBe(true)
  })

  it('shows ▼ icon when expanded', () => {
    const node = makeNode({ isCollapsible: true, type: 'object', childCount: 1 })
    const ctx = makeCtx({ expansion: { isExpanded: () => true, toggle: vi.fn() } })
    const wrapper = mountRow(node, ctx)
    expect(wrapper.find('.dv-ico--chevron-down').exists()).toBe(true)
  })

  it('emits toggle when toggle button is clicked', async () => {
    const node = makeNode({ isCollapsible: true, type: 'object', childCount: 1 })
    const wrapper = mountRow(node)
    await wrapper.find('.dv-row__toggle').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')![0]).toEqual([node.id])
  })

  it('applies dv-row--match class when isMatch returns true', () => {
    const ctx = makeCtx({ search: { isMatch: () => true, isActiveMatch: () => false } })
    const wrapper = mountRow(makeNode(), ctx)
    expect(wrapper.classes()).toContain('dv-row--match')
  })

  it('applies dv-row--active-match class when isActiveMatch returns true', () => {
    const ctx = makeCtx({ search: { isMatch: () => true, isActiveMatch: () => true } })
    const wrapper = mountRow(makeNode(), ctx)
    expect(wrapper.classes()).toContain('dv-row--active-match')
  })

  it('does not show toggle placeholder for non-collapsible node', () => {
    const wrapper = mountRow(makeNode({ isCollapsible: false }))
    expect(wrapper.find('.dv-row__toggle').exists()).toBe(false)
    expect(wrapper.find('.dv-row__toggle-placeholder').exists()).toBe(true)
  })

  it('emits click event when row is clicked', async () => {
    const node = makeNode()
    const wrapper = mountRow(node)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders highlighted html when tokenMap has entry', () => {
    const node = makeNode()
    const map = ref(new Map([['$.name', '<span style="color:green">"Alice"</span>']]))
    const ctx = makeCtx({ tokenMap: map })
    const wrapper = mountRow(node, ctx)
    expect(wrapper.find('.dv-node-value__shiki').exists()).toBe(true)
  })
})
