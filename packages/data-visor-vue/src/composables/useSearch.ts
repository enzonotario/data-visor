import { type ComputedRef, computed, type Ref, ref, watch } from 'vue'
import type { TreeNode } from '../types/tree'

export interface UseSearchReturn {
  query: Ref<string>
  searchScope: Ref<string | null>
  matchIds: ComputedRef<string[]>
  activeMatchId: ComputedRef<string | null>
  activeIndex: Ref<number>
  hasMatches: ComputedRef<boolean>
  nextMatch: () => void
  prevMatch: () => void
  clearSearch: () => void
  setSearchScope: (path: string | null) => void
  isMatch: (id: string) => boolean
  isActiveMatch: (id: string) => boolean
}

function nodeMatchesQuery(node: TreeNode, q: string): boolean {
  const lower = q.toLowerCase()
  if (q.startsWith('$')) {
    return node.path.toLowerCase().includes(lower)
  }
  const keyStr = node.key !== undefined ? String(node.key) : ''
  const valStr = node.value !== null && typeof node.value !== 'object' ? String(node.value) : ''
  return keyStr.toLowerCase().includes(lower) || valStr.toLowerCase().includes(lower)
}

export function useSearch(nodes: Ref<TreeNode[]>): UseSearchReturn {
  const query = ref('')
  const activeIndex = ref(0)
  const searchScope = ref<string | null>(null)

  watch(query, () => {
    activeIndex.value = 0
  })

  function inScope(nodePath: string): boolean {
    const scope = searchScope.value
    if (!scope) return true
    return (
      nodePath === scope || nodePath.startsWith(`${scope}.`) || nodePath.startsWith(`${scope}[`)
    )
  }

  const matchIds = computed<string[]>(() => {
    const q = query.value.trim()
    if (!q) return []
    return nodes.value
      .filter((n) => !n.isClosing && inScope(n.path) && nodeMatchesQuery(n, q))
      .map((n) => n.id)
  })

  const matchSet = computed<Set<string>>(() => new Set(matchIds.value))

  const hasMatches = computed(() => matchIds.value.length > 0)

  const activeMatchId = computed<string | null>(() => {
    if (!matchIds.value.length) return null
    return matchIds.value[activeIndex.value] ?? null
  })

  function nextMatch(): void {
    if (!matchIds.value.length) return
    activeIndex.value = (activeIndex.value + 1) % matchIds.value.length
  }

  function prevMatch(): void {
    if (!matchIds.value.length) return
    activeIndex.value = (activeIndex.value - 1 + matchIds.value.length) % matchIds.value.length
  }

  function clearSearch(): void {
    query.value = ''
    activeIndex.value = 0
  }

  function setSearchScope(path: string | null): void {
    searchScope.value = path
    activeIndex.value = 0
  }

  function isMatch(id: string): boolean {
    return matchSet.value.has(id)
  }

  function isActiveMatch(id: string): boolean {
    return activeMatchId.value === id
  }

  return {
    query,
    searchScope,
    matchIds,
    activeMatchId,
    activeIndex,
    hasMatches,
    nextMatch,
    prevMatch,
    clearSearch,
    setSearchScope,
    isMatch,
    isActiveMatch,
  }
}
