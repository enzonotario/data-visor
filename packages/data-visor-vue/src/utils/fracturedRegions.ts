import type { Formatter } from 'fracturedjsonjs'
import type { TreeNode, TreeValue } from '../types/tree'
import { buildPath, pathToSegments } from './path'

/** Parent path for tree paths (`$` → `$.a` → `$.a.b`). */
export function getParentPath(path: string): string | null {
  if (path === '$') return null
  const segments = pathToSegments(path)
  if (segments.length <= 1) return '$'
  let p = '$'
  for (let i = 0; i < segments.length - 1; i++) {
    p = buildPath(p, segments[i])
  }
  return p
}

function lineAtOffset(text: string, offset: number): number {
  let n = 0
  const end = Math.min(offset, text.length)
  for (let i = 0; i < end; i++) if (text[i] === '\n') n++
  return n
}

export interface FracturedRegion {
  node: TreeNode
  startLine: number
  endLine: number
}

/**
 * Maps collapsible JSON nodes to line ranges in a FracturedJson `Reformat` string so we can
 * resolve hover → node (deepest region containing the line), e.g. for the breadcrumb.
 */
export function buildFracturedRegions(
  fullText: string,
  nodes: TreeNode[],
  formatter: Formatter,
): FracturedRegion[] {
  const regions: FracturedRegion[] = []

  function directChildren(parentPath: string): TreeNode[] {
    const list = nodes.filter((n) => !n.isClosing && getParentPath(n.path) === parentPath)
    list.sort((a, b) => a.sourceLine - b.sourceLine)
    return list
  }

  function serializeForMatch(value: TreeValue): string {
    const raw = formatter.Serialize(value)
    if (raw === undefined) return ''
    return raw.replace(/\r?\n+$/, '')
  }

  function walk(parentPath: string, pStart: number, pEnd: number): void {
    const children = directChildren(parentPath)
    let localCursor = pStart
    for (const child of children) {
      const sub = serializeForMatch(child.value as TreeValue)
      if (sub === '') continue
      const idx = fullText.indexOf(sub, localCursor)
      if (idx === -1 || idx + sub.length > pEnd) continue
      if (child.isCollapsible) {
        const startLine = lineAtOffset(fullText, idx)
        const endLine = lineAtOffset(fullText, idx + sub.length - 1)
        regions.push({ node: child, startLine, endLine })
      }
      if (child.isCollapsible && child.childCount > 0) {
        walk(child.path, idx, idx + sub.length)
      }
      localCursor = idx + sub.length
    }
  }

  const root = nodes.find((n) => n.path === '$' && !n.isClosing)
  if (root?.isCollapsible) {
    const sub = serializeForMatch(root.value as TreeValue)
    if (sub !== '') {
      const startLine = 0
      const endLine = lineAtOffset(fullText, fullText.length - 1)
      regions.push({ node: root, startLine, endLine })
      walk('$', 0, fullText.length)
    }
  }

  return regions
}

export function deepestNodeForLine(line: number, regions: FracturedRegion[]): TreeNode | null {
  let best: TreeNode | null = null
  let bestDepth = -1
  for (const r of regions) {
    if (line >= r.startLine && line <= r.endLine && r.node.depth > bestDepth) {
      bestDepth = r.node.depth
      best = r.node
    }
  }
  return best
}
