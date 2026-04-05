import type { NodeType, TreeArray, TreeNode, TreeObject, TreeValue } from '../types/tree'
import { buildPath } from './path'

function nodeType(value: TreeValue): NodeType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  switch (typeof value) {
    case 'object':
      return 'object'
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
  }
}

function childCount(value: TreeValue): number {
  if (value === null || typeof value !== 'object') return 0
  return Array.isArray(value) ? value.length : Object.keys(value).length
}

function sourceLinesTotal(value: TreeValue): number {
  if (value === null || typeof value !== 'object') return 1
  if (Array.isArray(value)) {
    if (value.length === 0) return 1
    return 2 + value.reduce((sum: number, v: TreeValue) => sum + sourceLinesTotal(v), 0)
  }
  const keys = Object.keys(value as TreeObject)
  if (keys.length === 0) return 1
  return (
    2 + keys.reduce((sum: number, k: string) => sum + sourceLinesTotal((value as TreeObject)[k]), 0)
  )
}

function buildNodes(
  value: TreeValue,
  key: string | number | undefined,
  depth: number,
  path: string,
  result: TreeNode[],
  sourceLine: number,
): void {
  const type = nodeType(value)
  const count = childCount(value)

  const node: TreeNode = {
    id: path || '$',
    type,
    key,
    value,
    depth,
    path,
    childCount: count,
    isCollapsible: count > 0,
    sourceLine,
  }
  result.push(node)

  const parentId = path || '$'

  if (type === 'array' && count > 0) {
    const arr = value as TreeArray
    let childLine = sourceLine + 1
    for (let i = 0; i < arr.length; i++) {
      buildNodes(arr[i], i, depth + 1, buildPath(path, i), result, childLine)
      childLine += sourceLinesTotal(arr[i])
    }
    result.push({
      id: `${parentId}/$close`,
      type,
      key: undefined,
      value,
      depth,
      path,
      childCount: count,
      isCollapsible: false,
      sourceLine: sourceLine + sourceLinesTotal(value) - 1,
      isClosing: true,
      parentId,
    })
  } else if (type === 'object' && count > 0) {
    const obj = value as TreeObject
    let childLine = sourceLine + 1
    for (const k of Object.keys(obj)) {
      buildNodes(obj[k], k, depth + 1, buildPath(path, k), result, childLine)
      childLine += sourceLinesTotal(obj[k])
    }
    result.push({
      id: `${parentId}/$close`,
      type,
      key: undefined,
      value,
      depth,
      path,
      childCount: count,
      isCollapsible: false,
      sourceLine: sourceLine + sourceLinesTotal(value) - 1,
      isClosing: true,
      parentId,
    })
  }
}

export interface BuildTreeOptions {
  rootPath?: string
}

export function buildTree(value: TreeValue, options: BuildTreeOptions = {}): TreeNode[] {
  const result: TreeNode[] = []
  buildNodes(value, undefined, 0, options.rootPath ?? '$', result, 0)
  return result
}
