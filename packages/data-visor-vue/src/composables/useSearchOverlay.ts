import { nextTick, type Ref, ref } from 'vue'
import type { TreeNode } from '../types/tree'
import type { UseExpansionReturn } from './useExpansion'
import type { UseSearchReturn } from './useSearch'
import type { UseVirtualScrollReturn } from './useVirtualScroll'

export interface UseSearchOverlayReturn {
  searchOpen: Ref<boolean>
  searchAnchorPos: Ref<{ top: number; left: number } | null>
  openSearch: () => void
  closeSearch: () => void
  openSearchWithScope: (path: string, anchor: HTMLElement) => void
  nextMatch: () => void
  prevMatch: () => void
}

export function useSearchOverlay(
  search: Pick<
    UseSearchReturn,
    'nextMatch' | 'prevMatch' | 'activeMatchId' | 'setSearchScope' | 'clearSearch'
  >,
  expansion: Pick<UseExpansionReturn, 'expandPath'>,
  vScroll: Pick<UseVirtualScrollReturn, 'scrollToNode'>,
  nodes: Ref<TreeNode[]>,
  viewerRef: Ref<HTMLElement | null>,
  focusSearch: () => void,
): UseSearchOverlayReturn {
  const searchOpen = ref(false)
  const searchAnchorPos = ref<{ top: number; left: number } | null>(null)

  function openSearch(): void {
    searchAnchorPos.value = null
    search.setSearchScope(null)
    searchOpen.value = true
    nextTick(focusSearch)
  }

  function closeSearch(): void {
    searchOpen.value = false
    searchAnchorPos.value = null
    search.clearSearch()
    search.setSearchScope(null)
  }

  function openSearchWithScope(path: string, anchor: HTMLElement): void {
    if (!viewerRef.value) return
    const anchorRect = anchor.getBoundingClientRect()
    const viewerRect = viewerRef.value.getBoundingClientRect()
    searchAnchorPos.value = {
      top: anchorRect.bottom - viewerRect.top + 6,
      left: Math.max(8, anchorRect.left - viewerRect.left),
    }
    search.setSearchScope(path)
    searchOpen.value = true
    nextTick(focusSearch)
  }

  function nextMatch(): void {
    search.nextMatch()
    if (search.activeMatchId.value) {
      expansion.expandPath(search.activeMatchId.value, nodes.value)
      vScroll.scrollToNode(search.activeMatchId.value)
    }
  }

  function prevMatch(): void {
    search.prevMatch()
    if (search.activeMatchId.value) {
      expansion.expandPath(search.activeMatchId.value, nodes.value)
      vScroll.scrollToNode(search.activeMatchId.value)
    }
  }

  return {
    searchOpen,
    searchAnchorPos,
    openSearch,
    closeSearch,
    openSearchWithScope,
    nextMatch,
    prevMatch,
  }
}
