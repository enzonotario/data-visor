import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { UseExpansionReturn } from '../../composables/useExpansion'
import type { UseSearchReturn } from '../../composables/useSearch'
import type { TreeValue, ViewerLang } from '../../types/tree'

export interface ViewerContext {
  expansion: Pick<UseExpansionReturn, 'isExpanded' | 'toggle'>
  search: Pick<UseSearchReturn, 'isMatch' | 'isActiveMatch'>
  tokenMap: Ref<Map<string, string>>
  lang: Ref<ViewerLang>
  /** Subtree search from the row is only meaningful in tree view. */
  isTreeDisplayMode: ComputedRef<boolean>
  expandSubtree: (path: string) => void
  collapseSubtree: (path: string) => void
  expandSubtreeToDepth: (path: string, baseDepth: number, relativeDepth: number) => void
  openSearchWithScope: (path: string, anchor: HTMLElement) => void
  copyNode: (value: TreeValue, nodePath: string) => void
  copiedNodePath: Ref<string | null>
  selectedLevel: Ref<number>
  setSelectedLevel: (n: number) => void
}

export const VIEWER_KEY: InjectionKey<ViewerContext> = Symbol('viewer')
