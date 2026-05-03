const DEPTH = 28
const EXTS = ['json', 'yaml', 'yml', 'xml'] as const

function patternsForExt(schemePrefix: string, ext: string): string[] {
  const out: string[] = []
  for (let d = 1; d <= DEPTH; d++) {
    out.push(`${schemePrefix}/${Array(d).fill('*').join('/')}.${ext}`)
  }
  return out
}

export function buildViewerMatchPatterns(): string[] {
  const list: string[] = []
  // Any http(s) page: the script exits immediately unless the URL looks like a data file
  // or the document MIME is JSON/XML/YAML (e.g. APIs without a filename extension).
  list.push('http://*/*', 'https://*/*')
  for (const ext of EXTS) {
    list.push(...patternsForExt('*://*', ext))
  }
  list.push('file:///*')
  return list
}

export const VIEWER_MATCH_PATTERNS = buildViewerMatchPatterns()
