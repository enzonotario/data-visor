import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchBar from '../../src/components/DataVisor/SearchBar.vue'

function mountBar() {
  return mount(SearchBar, {
    props: {
      query: 'a',
      matchCount: 2,
      activeIndex: 0,
      hasMatches: true,
    },
  })
}

describe('SearchBar', () => {
  it('Enter emits next', async () => {
    const w = mountBar()
    const input = w.find('input')
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('next')).toHaveLength(1)
    expect(w.emitted('prev')).toBeFalsy()
  })

  it('Shift+Enter emits prev and not next', async () => {
    const w = mountBar()
    const input = w.find('input')
    await input.trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(w.emitted('prev')).toHaveLength(1)
    expect(w.emitted('next')).toBeFalsy()
  })
})
