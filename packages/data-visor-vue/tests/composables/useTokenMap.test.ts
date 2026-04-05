import { describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import type { UseShikiReturn } from '../../src/composables/useShiki'
import { useTokenMap } from '../../src/composables/useTokenMap'
import { buildTree } from '../../src/utils/tree'

function makeShiki(overrides: Partial<UseShikiReturn> = {}): UseShikiReturn {
  return {
    highlighter: ref(null) as UseShikiReturn['highlighter'],
    isReady: ref(true),
    highlight: vi
      .fn()
      .mockReturnValue(
        '<pre><code>\n<span class="line"><span style="color:red">"name"</span>: <span style="color:blue">"Alice"</span></span>\n</code></pre>',
      ),
    load: vi.fn().mockResolvedValue(undefined),
    getThemeColors: vi.fn().mockReturnValue({ bg: '#1e1e2e', fg: '#cdd6f4' }),
    ...overrides,
  }
}

describe('useTokenMap', () => {
  it('returns empty map when shiki is not ready', () => {
    const content = ref('{"name":"Alice"}')
    const lang = ref<'json'>('json')
    const nodes = computed(() => buildTree(JSON.parse(content.value)))
    const shiki = makeShiki({ isReady: ref(false) })
    const theme = computed(() => 'github-dark')

    const { tokenMap } = useTokenMap(content, lang, nodes, shiki, theme)
    expect(tokenMap.value.size).toBe(0)
  })

  it('returns empty map for non-JSON lang', () => {
    const content = ref('name: Alice')
    const lang = ref<'yaml'>('yaml')
    const nodes = computed(() => buildTree({ name: 'Alice' }))
    const shiki = makeShiki()
    const theme = computed(() => 'github-dark')

    const { tokenMap } = useTokenMap(content, lang, nodes, shiki, theme)
    expect(tokenMap.value.size).toBe(0)
  })

  it('applies theme colors from shiki', async () => {
    const content = ref('{"a":1}')
    const lang = ref<'json'>('json')
    const nodes = computed(() => buildTree(JSON.parse(content.value)))
    const shiki = makeShiki({
      getThemeColors: vi.fn().mockReturnValue({ bg: '#282c34', fg: '#abb2bf' }),
    })
    const theme = computed(() => 'one-dark-pro')

    const { themeBg, themeFg } = useTokenMap(content, lang, nodes, shiki, theme)
    // Wait for the initial shiki.load().then() microtask to run
    await Promise.resolve()
    expect(shiki.getThemeColors).toHaveBeenCalledWith('one-dark-pro')
    expect(themeBg.value).toBe('#282c34')
    expect(themeFg.value).toBe('#abb2bf')
  })

  it('falls back to default colors when getThemeColors returns null', () => {
    const content = ref('{"a":1}')
    const lang = ref<'json'>('json')
    const nodes = computed(() => buildTree(JSON.parse(content.value)))
    const shiki = makeShiki({
      getThemeColors: vi.fn().mockReturnValue(null),
    })
    const theme = computed(() => 'github-dark')

    const { themeBg, themeFg } = useTokenMap(content, lang, nodes, shiki, theme)
    expect(themeBg.value).toBe('#1e1e2e')
    expect(themeFg.value).toBe('#cdd6f4')
  })

  it('calls shiki.load on setup with current theme and lang', () => {
    const content = ref('{"a":1}')
    const lang = ref<'json'>('json')
    const nodes = computed(() => buildTree(JSON.parse(content.value)))
    const shiki = makeShiki()
    const theme = computed(() => 'nord')

    useTokenMap(content, lang, nodes, shiki, theme)
    expect(shiki.load).toHaveBeenCalledWith('nord', 'json', [])
  })

  it('prettifies minified JSON before highlight so sourceLine matches buildTree', async () => {
    const minified = '{"a":1}'
    const content = ref(minified)
    const lang = ref<'json'>('json')
    const nodes = computed(() => buildTree(JSON.parse(content.value)))
    const highlight = vi
      .fn()
      .mockReturnValue(
        '<pre><code><span class="line"><span style="color:red">{</span></span>\n<span class="line"><span style="color:blue">x</span></span>\n</code></pre>',
      )
    const shiki = makeShiki({ highlight })
    const theme = computed(() => 'github-dark')

    useTokenMap(content, lang, nodes, shiki, theme)
    await Promise.resolve()
    expect(highlight).toHaveBeenCalled()
    const arg0 = highlight.mock.calls[0]?.[0] as string
    expect(arg0).toContain('\n')
    expect(arg0).toBe(JSON.stringify(JSON.parse(minified), null, 2))
  })
})
