import { useEventListener, useResizeObserver } from '@vueuse/core'
import { type ComputedRef, computed, type Ref, ref } from 'vue'
import type { TreeNode } from '../types/tree'

export const ROW_HEIGHT = 24
const OVERSCAN = 5

export interface UseVirtualScrollReturn {
  containerRef: Ref<HTMLElement | null>
  visibleSlice: ComputedRef<TreeNode[]>
  totalHeight: ComputedRef<number>
  offsetY: ComputedRef<number>
  scrollToNode: (id: string) => void
}

export function useVirtualScroll(nodes: Ref<TreeNode[]>): UseVirtualScrollReturn {
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const viewportHeight = ref(600)

  useResizeObserver(containerRef, (entries) => {
    const h = entries[0]?.contentRect.height
    if (h != null && h > 0) viewportHeight.value = h
  })

  useEventListener(containerRef, 'scroll', () => {
    scrollTop.value = containerRef.value?.scrollTop ?? 0
  })

  const totalHeight = computed(() => nodes.value.length * ROW_HEIGHT)

  const firstVisible = computed(() => {
    const raw = Math.floor(scrollTop.value / ROW_HEIGHT) - OVERSCAN
    return Math.max(0, raw)
  })

  const lastVisible = computed(() => {
    const raw = Math.ceil((scrollTop.value + viewportHeight.value) / ROW_HEIGHT) + OVERSCAN
    return Math.min(nodes.value.length - 1, raw)
  })

  const offsetY = computed(() => firstVisible.value * ROW_HEIGHT)

  const visibleSlice = computed(() => nodes.value.slice(firstVisible.value, lastVisible.value + 1))

  function scrollToNode(id: string): void {
    const idx = nodes.value.findIndex((n) => n.id === id)
    if (idx === -1 || !containerRef.value) return
    const top = idx * ROW_HEIGHT
    const bottom = top + ROW_HEIGHT
    const { scrollTop: st, clientHeight } = containerRef.value
    if (top < st) {
      containerRef.value.scrollTop = top
    } else if (bottom > st + clientHeight) {
      containerRef.value.scrollTop = bottom - clientHeight
    }
  }

  return { containerRef, visibleSlice, totalHeight, offsetY, scrollToNode }
}
