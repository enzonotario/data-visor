import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

async function flushDom() {
  await nextTick()
  await nextTick()
}

import Breadcrumb from '../../src/components/DataVisor/Breadcrumb.vue'
import DataVisor from '../../src/components/DataVisor/DataVisor.vue'
import SearchBar from '../../src/components/DataVisor/SearchBar.vue'
import Toolbar from '../../src/components/DataVisor/Toolbar.vue'
import VirtualList from '../../src/components/DataVisor/VirtualList.vue'

function mountViewer(
  payload: unknown = { name: 'Alice', age: 30 },
  props: Record<string, unknown> = {},
) {
  const dataStr = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)
  return mount(DataVisor, {
    props: { data: dataStr, lang: 'json', ...props },
    global: {
      components: {
        Toolbar,
        SearchBar,
        VirtualList,
        Breadcrumb,
      },
    },
    attachTo: document.body,
  })
}

describe('DataVisor — JSON', () => {
  it('renders without error for a simple object', () => {
    const wrapper = mountViewer()
    expect(wrapper.find('.dv-viewer').exists()).toBe(true)
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
  })

  it('renders without error for an array', () => {
    const wrapper = mountViewer(JSON.stringify([1, 2, 3]))
    expect(wrapper.find('.dv-viewer').exists()).toBe(true)
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
  })

  it('shows error for invalid JSON string', () => {
    const wrapper = mountViewer('{ invalid json }')
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(true)
  })

  it('accepts valid JSON string', () => {
    const wrapper = mountViewer(JSON.stringify({ name: 'Alice', age: 30 }))
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
  })

  it('shows toolbar by default', () => {
    const wrapper = mountViewer()
    expect(wrapper.find('.dv-toolbar').exists()).toBe(true)
  })

  it('hides toolbar when showToolbar=false', () => {
    const wrapper = mountViewer({ name: 'Alice' }, { showToolbar: false })
    expect(wrapper.find('.dv-toolbar').exists()).toBe(false)
  })

  it('shows breadcrumb by default', () => {
    const wrapper = mountViewer()
    expect(wrapper.find('.dv-breadcrumb').exists()).toBe(true)
  })

  it('hides breadcrumb when showBreadcrumb=false', () => {
    const wrapper = mountViewer({ name: 'Alice' }, { showBreadcrumb: false })
    expect(wrapper.find('.dv-breadcrumb').exists()).toBe(false)
  })

  it('opens search bar when toolbar search button is clicked', async () => {
    const wrapper = mountViewer()
    expect(wrapper.find('.dv-search-bar').exists()).toBe(false)
    const btn = wrapper.find('button[title*="Search"]')
    await btn.trigger('click')
    expect(wrapper.find('.dv-search-bar').exists()).toBe(true)
  })

  it('CTRL+SHIFT+- collapses and CTRL+SHIFT++ expands via keyboard', async () => {
    const wrapper = mountViewer({ a: { b: { c: 1 } } })
    await flushDom()
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: '-',
        code: 'Minus',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    )
    await flushDom()
    const collapsedCount = wrapper.findAll('.dv-row').length
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: '+',
        code: 'Equal',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    )
    await flushDom()
    expect(wrapper.findAll('.dv-row').length).toBeGreaterThan(collapsedCount)
    wrapper.unmount()
  })

  it('closes search on Escape when focus is not on the search input', async () => {
    const wrapper = mountViewer()
    await wrapper.find('button[title*="Search"]').trigger('click')
    await flushDom()
    expect(wrapper.find('.dv-search-bar').exists()).toBe(true)
    ;(wrapper.find('.dv-search-bar__input').element as HTMLInputElement).blur()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushDom()
    expect(wrapper.find('.dv-search-bar').exists()).toBe(false)
  })

  it('emits copy event when copy button is clicked', async () => {
    const wrapper = mountViewer()
    const btn = wrapper.find('button[title*="Copy"]')
    await btn.trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
  })

  it('emits node-click when a row is clicked', async () => {
    const wrapper = mountViewer()
    const row = wrapper.find('.dv-row')
    await row.trigger('click')
    expect(wrapper.emitted('node-click')).toBeTruthy()
  })

  it('renders the virtual list container', () => {
    const wrapper = mountViewer()
    expect(wrapper.find('.dv-virtual-list').exists()).toBe(true)
  })

  it('shows minified Shiki source when displayMode is minified', async () => {
    const wrapper = mountViewer({ a: 1 }, { displayMode: 'minified' })
    await flushDom()
    await flushDom()
    expect(wrapper.find('.dv-source-minified').exists()).toBe(true)
    expect(wrapper.find('.dv-virtual-list').exists()).toBe(false)
    const searchBtn = wrapper.find('button[title="Search (CTRL+F)"]')
    expect(searchBtn.exists()).toBe(true)
    expect((searchBtn.element as HTMLButtonElement).disabled).toBe(true)
    wrapper.unmount()
  })

  it('applies custom maxHeight and minHeight on the wrap (DOM style)', async () => {
    const wrapper = mountViewer({ name: 'Alice' }, { maxHeight: 'none', minHeight: '100px' })
    await nextTick()
    const el = wrapper.find('.dv-viewer-wrap').element as HTMLElement
    expect(el.style.maxHeight).toBe('none')
    expect(el.style.getPropertyValue('min-height')).toBe('100px')
  })

  it('uses intrinsic list layout for max-height auto', () => {
    const wrapper = mountViewer({ name: 'Alice' }, { maxHeight: 'auto' })
    expect(wrapper.find('.dv-viewer').classes()).toContain('dv-viewer--intrinsic')
  })

  it('maps kebab-case min-height in template to minHeight prop', async () => {
    const Host = defineComponent({
      components: { DataVisor },
      template: '<DataVisor :data="c" min-height="300px" />',
      data: () => ({ c: JSON.stringify({ a: 1 }) }),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const inner = wrapper.findComponent(DataVisor)
    expect(inner.props('minHeight')).toBe('300px')
    await nextTick()
    const el = wrapper.find('.dv-viewer-wrap').element as HTMLElement
    expect(el.style.getPropertyValue('min-height')).toBe('300px')
    wrapper.unmount()
  })

  it('accepts min-height as props object key (kebab-case)', () => {
    const wrapper = mount(DataVisor, {
      props: { data: '{}', 'min-height': '300px' },
      global: {
        components: { Toolbar, SearchBar, VirtualList, Breadcrumb },
      },
      attachTo: document.body,
    })
    expect(wrapper.props('minHeight')).toBe('300px')
    wrapper.unmount()
  })

  it('clamps wrap height between min and max px after collapse and expand all', async () => {
    const wide = Object.fromEntries(Array.from({ length: 80 }, (_, i) => [`k${i}`, i]))
    const wrapper = mountViewer(wide, { minHeight: '300px', maxHeight: '500px' })
    await flushDom()
    const wrap = wrapper.find('.dv-viewer-wrap').element as HTMLElement

    await wrapper.find('button[title="Collapse all (CTRL+[ or CTRL+SHIFT+-)"]').trigger('click')
    await flushDom()
    const hCollapsed = parseFloat(wrap.style.getPropertyValue('height'))
    expect(hCollapsed).toBeGreaterThanOrEqual(299)
    expect(hCollapsed).toBeLessThanOrEqual(310)

    await wrapper.find('button[title="Expand all (CTRL+] or CTRL+SHIFT++)"]').trigger('click')
    await flushDom()
    const hExpanded = parseFloat(wrap.style.getPropertyValue('height'))
    expect(hExpanded).toBeGreaterThanOrEqual(495)
    expect(hExpanded).toBeLessThanOrEqual(505)

    wrapper.unmount()
  })

  it('does not set fixed wrap height when max-height is intrinsic (min-height only in px)', async () => {
    const wrapper = mountViewer({ a: 1 }, { minHeight: '200px', maxHeight: 'none' })
    await flushDom()
    const wrap = wrapper.find('.dv-viewer-wrap').element as HTMLElement
    expect(wrap.style.getPropertyValue('height')).toBe('')
    wrapper.unmount()
  })
})

describe('DataVisor — YAML', () => {
  it('renders without error for simple YAML', () => {
    const wrapper = mountViewer('name: Alice\nage: 30', { lang: 'yaml' })
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
    expect(wrapper.find('.dv-virtual-list').exists()).toBe(true)
  })

  it('shows error for invalid YAML', () => {
    const wrapper = mountViewer('key: [unclosed', { lang: 'yaml' })
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(true)
  })

  it('renders YAML array at root', () => {
    const wrapper = mountViewer('- one\n- two\n- three', { lang: 'yaml' })
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
  })
})

describe('DataVisor — XML', () => {
  it('renders without error for simple XML', () => {
    const xml = '<root><name>Alice</name><age>30</age></root>'
    const wrapper = mountViewer(xml, { lang: 'xml' })
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
    expect(wrapper.find('.dv-virtual-list').exists()).toBe(true)
  })

  it('renders XML with attributes', () => {
    const xml = '<user id="1"><name>Alice</name></user>'
    const wrapper = mountViewer(xml, { lang: 'xml' })
    expect(wrapper.find('.dv-viewer__error').exists()).toBe(false)
  })
})
