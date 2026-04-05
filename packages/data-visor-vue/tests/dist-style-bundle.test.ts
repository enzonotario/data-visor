import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const distCss = path.resolve(process.cwd(), 'dist/style.css')

describe('dist/style.css', () => {
  it('exists and has no @apply after build', () => {
    if (!existsSync(distCss)) {
      throw new Error('Missing dist/style.css — run pnpm --filter data-visor-vue build')
    }
    const css = readFileSync(distCss, 'utf8')
    expect(css).not.toMatch(/@apply\b/)
  })
})
