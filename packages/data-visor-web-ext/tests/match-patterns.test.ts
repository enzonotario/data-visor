import { describe, expect, it } from 'vitest'
import { buildViewerMatchPatterns, VIEWER_MATCH_PATTERNS } from '@/lib/match-patterns'

describe('match-patterns', () => {
  it('includes file catch-all', () => {
    expect(VIEWER_MATCH_PATTERNS).toContain('file:///*')
  })

  it('covers deep paths for json', () => {
    const p = buildViewerMatchPatterns()
    expect(p).toContain('*://*/*/*/*.json')
    expect(p).toContain('*://*/*/*/*/*/*.json')
  })

  it('includes http(s) catch-all for MIME-based activation', () => {
    expect(VIEWER_MATCH_PATTERNS).toContain('http://*/*')
    expect(VIEWER_MATCH_PATTERNS).toContain('https://*/*')
  })

  it('has expected size', () => {
    expect(VIEWER_MATCH_PATTERNS.length).toBe(28 * 4 + 1 + 2)
  })
})
