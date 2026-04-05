import type { BundledTheme } from 'shiki'
import { bundledThemesInfo } from 'shiki'

const DARK_IDS = new Set(
  bundledThemesInfo.filter((t) => t.type === 'dark').map((t) => t.id as BundledTheme),
)
const LIGHT_IDS = new Set(
  bundledThemesInfo.filter((t) => t.type === 'light').map((t) => t.id as BundledTheme),
)

export function normalizeDarkSyntaxTheme(id: string | null | undefined): BundledTheme {
  if (id && DARK_IDS.has(id as BundledTheme)) return id as BundledTheme
  return 'github-dark'
}

export function normalizeLightSyntaxTheme(id: string | null | undefined): BundledTheme {
  if (id && LIGHT_IDS.has(id as BundledTheme)) return id as BundledTheme
  return 'github-light'
}
