import { vi } from 'vitest'

Object.assign(document, { execCommand: vi.fn().mockReturnValue(true) })

vi.mock('../src/composables/useShiki', () => ({
  useShiki: () => ({
    highlighter: { value: null },
    isReady: { value: true },
    highlight: (code: string, _theme: string, _lang: string) => `<pre><code>${code}</code></pre>`,
    load: vi.fn().mockResolvedValue(undefined),
    getThemeColors: vi.fn().mockReturnValue({ bg: '#1e1e2e', fg: '#cdd6f4' }),
  }),
  themeKey: (t: unknown) =>
    typeof t === 'string' ? t : String((t as { name?: string })?.name ?? ''),
  resetShikiSingleton: vi.fn(),
}))
