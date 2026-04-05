import { type ComputedRef, computed, type Ref, ref } from 'vue'
import type { TreeNode } from '../types/tree'

export interface UseExpansionReturn {
  expandedIds: Ref<Set<string>>
  visibleNodes: ComputedRef<TreeNode[]>
  isExpanded: (id: string) => boolean
  toggle: (id: string) => void
  expandToDepth: (depth: number) => void
  expandAll: () => void
  collapseAll: () => void
  expandPath: (path: string, nodes: TreeNode[]) => void
  expandSubtree: (path: string) => void
  collapseSubtree: (path: string) => void
  expandSubtreeToDepth: (path: string, baseDepth: number, relativeDepth: number) => void
}

export function useExpansion(nodes: Ref<TreeNode[]>): UseExpansionReturn {
  const expandedIds = ref(new Set<string>())

  const visibleNodes = computed<TreeNode[]>(() => {
    const result: TreeNode[] = []
    const parentExpanded = new Map<number, boolean>()
    parentExpanded.set(-1, true)

    for (const node of nodes.value) {
      if (node.isClosing) {
        const ancestorVisible = parentExpanded.get(node.depth - 1) ?? false
        const itsParentExpanded = node.parentId ? expandedIds.value.has(node.parentId) : false
        if (ancestorVisible && itsParentExpanded) {
          result.push(node)
        }
        continue
      }
      const parentVisible = parentExpanded.get(node.depth - 1) ?? false
      if (!parentVisible) {
        parentExpanded.set(node.depth, false)
        continue
      }
      result.push(node)
      parentExpanded.set(node.depth, expandedIds.value.has(node.id))
    }
    return result
  })

  function isExpanded(id: string): boolean {
    return expandedIds.value.has(id)
  }

  function toggle(id: string): void {
    const next = new Set(expandedIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expandedIds.value = next
  }

  function expandToDepth(depth: number): void {
    const next = new Set<string>()
    for (const node of nodes.value) {
      if (node.isCollapsible && node.depth < depth) next.add(node.id)
    }
    expandedIds.value = next
  }

  function expandAll(): void {
    const next = new Set<string>()
    for (const node of nodes.value) {
      if (node.isCollapsible) next.add(node.id)
    }
    expandedIds.value = next
  }

  function collapseAll(): void {
    expandedIds.value = new Set()
  }

  function expandPath(path: string, allNodes: TreeNode[]): void {
    const next = new Set(expandedIds.value)
    for (const node of allNodes) {
      if (path.startsWith(node.path) && node.path !== path && node.isCollapsible) {
        next.add(node.id)
      }
    }
    expandedIds.value = next
  }

  function inSubtree(nodePath: string, rootPath: string): boolean {
    return (
      nodePath === rootPath ||
      nodePath.startsWith(`${rootPath}.`) ||
      nodePath.startsWith(`${rootPath}[`)
    )
  }

  function expandSubtree(path: string): void {
    const next = new Set(expandedIds.value)
    for (const node of nodes.value) {
      if (node.isCollapsible && inSubtree(node.path, path)) next.add(node.id)
    }
    expandedIds.value = next
  }

  function collapseSubtree(path: string): void {
    const next = new Set(expandedIds.value)
    for (const node of nodes.value) {
      if (node.isCollapsible && inSubtree(node.path, path)) next.delete(node.id)
    }
    expandedIds.value = next
  }

  function expandSubtreeToDepth(path: string, baseDepth: number, relativeDepth: number): void {
    const next = new Set(expandedIds.value)
    for (const node of nodes.value) {
      if (!node.isCollapsible || !inSubtree(node.path, path)) continue
      if (node.depth < baseDepth + relativeDepth) next.add(node.id)
      else next.delete(node.id)
    }
    expandedIds.value = next
  }

  return {
    expandedIds,
    visibleNodes,
    isExpanded,
    toggle,
    expandToDepth,
    expandAll,
    collapseAll,
    expandPath,
    expandSubtree,
    collapseSubtree,
    expandSubtreeToDepth,
  }
}
