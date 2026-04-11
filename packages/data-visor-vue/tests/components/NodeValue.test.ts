import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { ViewerContext } from '../../src/components/DataVisor/injectionKey'
import { VIEWER_KEY } from '../../src/components/DataVisor/injectionKey'
import NodeValue from '../../src/components/DataVisor/NodeValue.vue'
import type { TreeNode } from '../../src/types/tree'

function makeCtx(lang: 'json' | 'yaml' | 'xml' = 'json'): ViewerContext {
  return {
    expansion: { isExpanded: () => false, toggle: () => {} },
    search: { isMatch: () => false, isActiveMatch: () => false },
    tokenMap: ref(new Map()),
    copiedNodePath: ref(null),
    lang: ref(lang),
  } as unknown as ViewerContext
}

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

function mountNodeValue(
  node: TreeNode,
  extra: Partial<Parameters<typeof mount>[1]> = {},
  lang: 'json' | 'yaml' | 'xml' = 'json',
) {
  return mount(NodeValue, {
    props: {
      node,
      highlightedHtml: '',
      isMatch: false,
      isActiveMatch: false,
      isExpanded: false,
    },
    global: {
      plugins: [{ install: (app) => app.provide(VIEWER_KEY, makeCtx(lang)) }],
    },
    ...extra,
  })
}

describe('NodeValue — JSON', () => {
  it('renders key text for a leaf node', () => {
    const wrapper = mountNodeValue(makeNode())
    expect(wrapper.find('.dv-node-value__key-text').text()).toBe('"name"')
  })

  it('renders colon after key', () => {
    const wrapper = mountNodeValue(makeNode())
    expect(wrapper.find('.dv-node-value__colon').exists()).toBe(true)
  })

  it('renders string value', () => {
    const wrapper = mountNodeValue(makeNode())
    expect(wrapper.find('.dv-node-value__raw').text()).toBe('"Alice"')
  })

  it('renders opening bracket for collapsible object', () => {
    const node = makeNode({ type: 'object', isCollapsible: true, childCount: 2, value: { a: 1 } })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__bracket').text()).toBe('{')
  })

  it('renders opening bracket [ for collapsible array', () => {
    const node = makeNode({ type: 'array', isCollapsible: true, childCount: 3, value: [1, 2, 3] })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__bracket').text()).toBe('[')
  })

  it('shows collapsed badge with count when not expanded', () => {
    const node = makeNode({ type: 'object', isCollapsible: true, childCount: 5, value: {} })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__badge').text()).toBe('{5}')
  })

  it('does not show collapsed badge when expanded', () => {
    const node = makeNode({ type: 'object', isCollapsible: true, childCount: 2, value: {} })
    const wrapper = mount(NodeValue, {
      props: { node, highlightedHtml: '', isMatch: false, isActiveMatch: false, isExpanded: true },
      global: { plugins: [{ install: (app) => app.provide(VIEWER_KEY, makeCtx()) }] },
    })
    expect(wrapper.find('.dv-node-value__badge').exists()).toBe(false)
  })

  it('renders highlighted html when provided', () => {
    const node = makeNode()
    const wrapper = mount(NodeValue, {
      props: {
        node,
        highlightedHtml: '<span style="color:green">"Alice"</span>',
        isMatch: false,
        isActiveMatch: false,
        isExpanded: false,
      },
      global: { plugins: [{ install: (app) => app.provide(VIEWER_KEY, makeCtx()) }] },
    })
    expect(wrapper.find('.dv-node-value__shiki').exists()).toBe(true)
    expect(wrapper.find('.dv-node-value__shiki').html()).toContain('color:green')
  })

  it('does not render Shiki HTML when lang is not JSON (highlight tokens are JSON-shaped)', () => {
    const node = makeNode()
    const wrapper = mount(NodeValue, {
      props: {
        node,
        highlightedHtml: '<span style="color:green">"Alice"</span>',
        isMatch: false,
        isActiveMatch: false,
        isExpanded: false,
      },
      global: { plugins: [{ install: (app) => app.provide(VIEWER_KEY, makeCtx('yaml')) }] },
    })
    expect(wrapper.find('.dv-node-value__shiki').exists()).toBe(false)
    expect(wrapper.find('.dv-node-value__raw').text()).toBe('Alice')
  })

  it('renders closing bracket for closing node', () => {
    const node = makeNode({
      id: '$/$close',
      isClosing: true,
      type: 'object',
      key: undefined,
      path: '$',
    })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__bracket').text()).toBe('}')
  })

  it('renders number value without quotes', () => {
    const node = makeNode({ type: 'number', value: 42, key: 'age', id: '$.age', path: '$.age' })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__raw').text()).toBe('42')
  })

  it('renders null value', () => {
    const node = makeNode({ type: 'null', value: null, key: 'data', id: '$.data', path: '$.data' })
    const wrapper = mountNodeValue(node)
    expect(wrapper.find('.dv-node-value__raw').text()).toBe('null')
  })
})

describe('NodeValue — YAML', () => {
  it('renders dash prefix for array item', () => {
    const node = makeNode({ type: 'string', key: 0, value: 'foo', id: '$[0]', path: '$[0]' })
    const wrapper = mountNodeValue(node, {}, 'yaml')
    expect(wrapper.find('.dv-node-value__dash').exists()).toBe(true)
  })

  it('renders raw value after dash for array item', () => {
    const node = makeNode({ type: 'string', key: 0, value: 'bar', id: '$[0]', path: '$[0]' })
    const wrapper = mountNodeValue(node, {}, 'yaml')
    expect(wrapper.find('.dv-node-value__raw').text()).toBe('bar')
  })
})

describe('NodeValue — XML', () => {
  it('renders opening tag for xml-element-open', () => {
    const node = makeNode({
      type: 'object',
      key: 'user',
      value: { name: 'Alice' },
      isCollapsible: true,
      childCount: 1,
      id: '$.user',
      path: '$.user',
    })
    const wrapper = mountNodeValue(node, {}, 'xml')
    expect(wrapper.find('.dv-node-value__tag').text()).toContain('user')
  })

  it('renders attribute name and value', () => {
    const node = makeNode({
      type: 'string',
      key: '@_id',
      value: '42',
      id: '$.user.@_id',
      path: '$.user.@_id',
    })
    const wrapper = mountNodeValue(node, {}, 'xml')
    expect(wrapper.find('.dv-node-value__attr-name').text()).toBe('id')
  })
})
