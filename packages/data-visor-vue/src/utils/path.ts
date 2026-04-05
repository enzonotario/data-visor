import type { TreeValue } from '../types/tree'

export function buildPath(parentPath: string, key: string | number): string {
  if (typeof key === 'number') return `${parentPath}[${key}]`
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return `${parentPath}.${key}`
  return `${parentPath}["${key}"]`
}

export function pathToSegments(path: string): Array<string | number> {
  const segments: Array<string | number> = []
  const re = /\.([a-zA-Z_$][a-zA-Z0-9_$]*)|(?:\["([^"]+)"\])|\[(\d+)\]/g
  let match: RegExpExecArray | null
  while ((match = re.exec(path.replace(/^\$/, ''))) !== null) {
    if (match[1] !== undefined) segments.push(match[1])
    else if (match[2] !== undefined) segments.push(match[2])
    else if (match[3] !== undefined) segments.push(Number(match[3]))
  }
  return segments
}

export function nodeAtPath(root: TreeValue, path: string): TreeValue | undefined {
  const segments = pathToSegments(path)
  let current: TreeValue = root
  for (const seg of segments) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string | number, TreeValue>)[seg]
    if (current === undefined) return undefined
  }
  return current
}
