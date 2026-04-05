<script setup lang="ts">
import './dv-icons.css'
import { useClipboard, useEventListener, usePreferredDark } from '@vueuse/core'
import { computed, provide, ref, watch, watchPostEffect } from 'vue'
import { useChordShortcut } from '../../composables/useChordShortcut'
import { useCopyNode } from '../../composables/useCopyNode'
import { useExpansion } from '../../composables/useExpansion'
import { useSearch } from '../../composables/useSearch'
import { useSearchOverlay } from '../../composables/useSearchOverlay'
import { useShiki } from '../../composables/useShiki'
import { useTokenMap } from '../../composables/useTokenMap'
import { useTree } from '../../composables/useTree'
import { useVirtualScroll } from '../../composables/useVirtualScroll'
import type { DataVisorEmit, DataVisorProps, ShikiTheme, TreeNode } from '../../types/tree'
import Breadcrumb from './Breadcrumb.vue'
import { VIEWER_KEY } from './injectionKey'
import SearchBar from './SearchBar.vue'
import Toolbar from './Toolbar.vue'
import VirtualList from './VirtualList.vue'

function parseCssPx(value: string | undefined): number | null {
  if (value === undefined) return null
  const m = String(value)
    .trim()
    .match(/^(\d+(?:\.\d+)?)px$/i)
  return m ? Number(m[1]) : null
}

function measureChromeHeight(viewer: HTMLElement): number {
  let h = 0
  for (const child of Array.from(viewer.children)) {
    const el = child as HTMLElement
    if (el.classList.contains('dv-virtual-list')) continue
    const pos = getComputedStyle(el).position
    if (pos === 'absolute' || pos === 'fixed') continue
    h += el.offsetHeight
  }
  return h
}

function isIntrinsicMaxHeight(value: string | undefined): boolean {
  if (value === undefined) return false
  const v = value.toLowerCase().trim()
  return (
    v === 'none' ||
    v === 'auto' ||
    v === 'max-content' ||
    v === 'fit-content' ||
    v === 'min-content'
  )
}

const props = withDefaults(defineProps<DataVisorProps>(), {
  lang: 'json',
  darkTheme: 'github-dark',
  lightTheme: 'github-light',
  maxHeight: '600px',
  initialDepth: 2,
  showLineNumbers: true,
  showToolbar: true,
  showBreadcrumb: true,
})

const emit = defineEmits<DataVisorEmit>()

const dataRef = computed(() => props.data)
const langRef = computed(() => props.lang)
const { nodes, parseError } = useTree(dataRef, langRef)
const expansion = useExpansion(nodes)
const search = useSearch(nodes)
const shiki = useShiki()

const preferredDark = usePreferredDark()

const currentTheme = computed<ShikiTheme>(() => {
  const dark = props.isDark !== undefined ? props.isDark : preferredDark.value
  return dark ? props.darkTheme : props.lightTheme
})

const shikiPreloadThemes = computed<ShikiTheme[]>(() => [props.darkTheme, props.lightTheme])

const { tokenMap, themeBg, themeFg } = useTokenMap(
  dataRef,
  langRef,
  nodes,
  shiki,
  currentTheme,
  shikiPreloadThemes,
)

watch(
  () => props.initialDepth,
  (depth) => expansion.expandToDepth(depth),
  { immediate: true },
)

watch(nodes, () => {
  expansion.expandToDepth(props.initialDepth)
})

const vScroll = useVirtualScroll(expansion.visibleNodes)

const { copy } = useClipboard()
const { copiedNodePath, copyNode } = useCopyNode(langRef, copy)

const viewerRef = ref<HTMLElement | null>(null)
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const hoveredNode = ref<TreeNode | null>(null)

const overlay = useSearchOverlay(search, expansion, vScroll, nodes, viewerRef, () =>
  searchBarRef.value?.focus(),
)

const searchBarBind = computed(() => ({
  query: search.query.value,
  matchCount: search.matchIds.value.length,
  activeIndex: search.activeIndex.value,
  hasMatches: search.hasMatches.value,
  scopePath: overlay.searchAnchorPos.value ? search.searchScope.value : null,
}))

const floatingSearchStyle = computed(() => {
  const pos = overlay.searchAnchorPos.value
  if (!pos) return {}
  return { top: `${pos.top}px`, left: `${pos.left}px` }
})

const selectedLevel = ref(1)

provide(VIEWER_KEY, {
  expansion: {
    isExpanded: expansion.isExpanded,
    toggle: expansion.toggle,
  },
  search: {
    isMatch: search.isMatch,
    isActiveMatch: search.isActiveMatch,
  },
  tokenMap,
  lang: langRef,
  expandSubtree: expansion.expandSubtree,
  collapseSubtree: expansion.collapseSubtree,
  expandSubtreeToDepth: expansion.expandSubtreeToDepth,
  openSearchWithScope: overlay.openSearchWithScope,
  copyNode,
  copiedNodePath,
  selectedLevel,
  setSelectedLevel: (n: number) => {
    selectedLevel.value = n
  },
})

function copyContent() {
  copy(props.data)
  emit('copy', props.data)
}

function onBreadcrumbSegmentClick(path: string) {
  expansion.expandPath(path, nodes.value)
  expansion.toggle(path)
  const node = nodes.value.find((n) => n.path === path)
  if (node) vScroll.scrollToNode(node.id)
}

function onSearchQueryUpdate(value: string) {
  search.query.value = value
}

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && overlay.searchOpen.value) {
    e.preventDefault()
    overlay.closeSearch()
    return
  }
  if (e.ctrlKey && !e.shiftKey && e.key === 'f') {
    e.preventDefault()
    overlay.openSearch()
  }
  if (e.ctrlKey && !e.shiftKey && e.key === ']') {
    e.preventDefault()
    expansion.expandAll()
  }
  if (e.ctrlKey && !e.shiftKey && e.key === '[') {
    e.preventDefault()
    expansion.collapseAll()
  }
  if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
    if (e.key === '+' || e.code === 'NumpadAdd') {
      e.preventDefault()
      expansion.expandAll()
      return
    }
    if (e.key === '-' || e.code === 'NumpadSubtract') {
      e.preventDefault()
      expansion.collapseAll()
      return
    }
  }
  if (e.key === 'F3') {
    e.preventDefault()
    e.shiftKey ? overlay.prevMatch() : overlay.nextMatch()
  }
})

const chord = useChordShortcut()
chord.register({ ctrl: true, shift: true, key: '*' }, ([key]) => {
  const n = Number(key)
  if (!Number.isNaN(n)) {
    if (n === 0) expansion.collapseAll()
    else expansion.expandToDepth(n)
  }
})

watch(
  () => expansion.expandedIds.value.size,
  (size) => emit('expansion-change', size),
)

const usesIntrinsicListHeight = computed(() => isIntrinsicMaxHeight(props.maxHeight))

const hasViewerMinHeight = computed(
  () => props.minHeight != null && String(props.minHeight).trim() !== '',
)

const usesClampedOuterHeight = computed(() => {
  if (parseError.value) return false
  if (usesIntrinsicListHeight.value) return false
  if (!hasViewerMinHeight.value) return false
  return parseCssPx(props.maxHeight) != null && parseCssPx(String(props.minHeight).trim()) != null
})

const wrapRef = ref<HTMLElement | null>(null)

watchPostEffect(() => {
  const el = wrapRef.value
  const inner = viewerRef.value
  if (!el) return
  el.style.setProperty('max-height', props.maxHeight)
  el.style.setProperty('box-sizing', 'border-box')
  el.style.setProperty('width', '100%')
  if (hasViewerMinHeight.value) {
    el.style.setProperty('min-height', String(props.minHeight).trim(), 'important')
    el.style.setProperty('flex-shrink', '0', 'important')
  } else {
    el.style.removeProperty('min-height')
    el.style.removeProperty('flex-shrink')
  }

  if (usesClampedOuterHeight.value && inner) {
    const maxPx = parseCssPx(props.maxHeight)!
    const minPx = parseCssPx(String(props.minHeight).trim())!
    const lo = Math.min(minPx, maxPx)
    const hi = Math.max(minPx, maxPx)
    const chrome = measureChromeHeight(inner)
    const body = vScroll.totalHeight.value
    const desired = chrome + body
    const h = Math.round(Math.min(Math.max(desired, lo), hi))
    el.style.setProperty('height', `${h}px`, 'important')
  } else {
    el.style.removeProperty('height')
  }
})

const innerStyle = computed(() => {
  const s: Record<string, string> = {
    '--dv-bg': themeBg.value,
    '--dv-fg': themeFg.value,
  }
  if (usesIntrinsicListHeight.value) {
    s['--dv-list-min-height'] = `${vScroll.totalHeight.value}px`
  }
  return s
})
</script>

<template>
  <div
    ref="wrapRef"
    class="dv-viewer-wrap"
    :class="{
      'dv-viewer-wrap--has-min': hasViewerMinHeight,
      'dv-viewer-wrap--intrinsic': usesIntrinsicListHeight,
    }"
  >
    <div
      ref="viewerRef"
      class="dv-viewer"
      :class="{ 'dv-viewer--intrinsic': usesIntrinsicListHeight }"
      :style="innerStyle"
      :data-theme="currentTheme"
    >
      <Toolbar
        v-if="props.showToolbar"
        :is-awaiting-chord="chord.isAwaitingSequence.value"
        @expand-all="expansion.expandAll()"
        @collapse-all="expansion.collapseAll()"
        @expand-to-depth="expansion.expandToDepth($event)"
        @toggle-search="overlay.searchOpen.value ? overlay.closeSearch() : overlay.openSearch()"
        @copy="copyContent"
      />

      <SearchBar
        v-if="overlay.searchOpen.value && !overlay.searchAnchorPos.value"
        ref="searchBarRef"
        v-bind="searchBarBind"
        @update:query="onSearchQueryUpdate"
        @next="overlay.nextMatch"
        @prev="overlay.prevMatch"
        @close="overlay.closeSearch"
      />

      <div
        v-if="overlay.searchOpen.value && overlay.searchAnchorPos.value"
        class="dv-floating-search"
        :style="floatingSearchStyle"
      >
        <SearchBar
          ref="searchBarRef"
          v-bind="searchBarBind"
          @update:query="onSearchQueryUpdate"
          @next="overlay.nextMatch"
          @prev="overlay.prevMatch"
          @close="overlay.closeSearch"
        />
      </div>

      <div v-if="parseError" class="dv-viewer__error" role="alert">
        {{ parseError }}
      </div>

      <VirtualList
        v-else
        :visible-slice="vScroll.visibleSlice.value"
        :all-visible-nodes="expansion.visibleNodes.value"
        :total-height="vScroll.totalHeight.value"
        :offset-y="vScroll.offsetY.value"
        :container-ref="(el: unknown) => { (vScroll.containerRef as unknown as { value: unknown }).value = el }"
        :show-line-numbers="props.showLineNumbers"
        @node-click="(node: TreeNode) => { hoveredNode = node; emit('node-click', node) }"
        @node-hover="(node: TreeNode | null) => { hoveredNode = node }"
      />

      <Breadcrumb
        v-if="props.showBreadcrumb"
        :node="hoveredNode"
        @segment-click="onBreadcrumbSegmentClick"
      />
    </div>
  </div>
</template>

<style scoped>
.dv-viewer-wrap {
  @apply flex flex-col w-full min-w-0;
  box-sizing: border-box;
}

.dv-viewer-wrap--has-min:not(.dv-viewer-wrap--intrinsic) > .dv-viewer {
  flex: 1 1 0;
}

.dv-viewer {
  @apply flex flex-col overflow-hidden relative border border-solid rounded-md;
  flex: 1 1 auto;
  min-height: 0;
  font-size: 13px;
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
  background: var(--dv-bg, #1e1e2e);
  color: var(--dv-fg, #cdd6f4);
  box-sizing: border-box;
}

.dv-floating-search {
  @apply absolute z-20 min-w-340px rounded-md overflow-hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  border: 1px solid color-mix(in srgb, var(--dv-fg, #cdd6f4) 25%, transparent);
}

.dv-viewer__error {
  @apply px-3 py-2;
  color: color-mix(in srgb, #e53e3e 80%, var(--dv-fg, #cdd6f4) 20%);
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 8%, var(--dv-bg, #1e1e2e));
}

:deep(.dv-toolbar) {
  @apply flex items-center gap-1 px-2 py-1 flex-shrink-0 flex-wrap;
  background: color-mix(in srgb, var(--dv-bg, #1e1e2e) 85%, #000 15%);
  border-bottom: 1px solid color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
}

:deep(.dv-toolbar__btn),
:deep(.dv-row__toggle),
:deep(.dv-search-bar__nav),
:deep(.dv-search-bar__close),
:deep(.dv-node-toolbar__btn),
:deep(.lp__arrow) {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
}

:deep(.dv-toolbar__btn) {
  @apply inline-flex items-center justify-center bg-none border border-solid border-transparent rounded-[3px] text-inherit cursor-pointer text-sm px-1.5 py-1;
}

:deep(.dv-toolbar__btn:hover),
:deep(.dv-toolbar__btn--active) {
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 30%, transparent);
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 10%, var(--dv-bg, #1e1e2e));
}

:deep(.dv-toolbar__select) {
  @apply rounded-[3px] text-inherit text-xs px-1 py-0.5;
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 8%, var(--dv-bg, #1e1e2e));
  border: 1px solid color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
}

:deep(.dv-toolbar__label) {
  @apply text-xs;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 50%, transparent);
}

:deep(.dv-toolbar__separator) {
  @apply w-px h-4 mx-0.5;
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
}

:deep(.dv-toolbar__chord-hint) {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #cba6f7;
  animation: dv-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

:deep(.dv-search-bar) {
  @apply flex items-center gap-1 px-2 py-1 flex-shrink-0;
  background: color-mix(in srgb, var(--dv-bg, #1e1e2e) 90%, #000 10%);
  border-bottom: 1px solid color-mix(in srgb, var(--dv-fg, #cdd6f4) 15%, transparent);
}

:deep(.dv-search-bar__input) {
  @apply flex-1 rounded-[3px] text-inherit font-inherit text-xs px-2 py-0.75 outline-none border border-solid;
  background: color-mix(in srgb, var(--dv-bg, #1e1e2e) 70%, #fff 30%);
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 30%, transparent);
}

:deep(.dv-search-bar__input:focus) {
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 60%, transparent);
}

:deep(.dv-search-bar__count) {
  @apply text-xs min-w-60px text-center;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 50%, transparent);
}

:deep(.dv-search-bar__nav),
:deep(.dv-search-bar__close) {
  @apply inline-flex items-center justify-center bg-none border border-solid border-transparent rounded-[3px] text-inherit cursor-pointer text-sm px-1.5 py-1;
}

:deep(.dv-search-bar__nav:hover),
:deep(.dv-search-bar__close:hover) {
  background: color-mix(in srgb, var(--dv-bg, #1e1e2e) 70%, #fff 30%);
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 40%, transparent);
}

:deep(.dv-search-bar__nav:disabled) {
  @apply opacity-40 cursor-default;
}

:deep(.dv-search-bar__scope) {
  @apply text-3 font-medium rounded-[3px] px-1.5 py-0.25 max-w-180px overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0 border border-solid;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 50%, transparent);
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 8%, transparent);
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
}

:deep(.dv-virtual-list) {
  @apply flex-1 min-h-0 overflow-y-auto;
}

.dv-viewer--intrinsic :deep(.dv-virtual-list) {
  flex: 1 0 auto;
  min-height: var(--dv-list-min-height, 0px);
}

:deep(.dv-virtual-list__spacer) {
  @apply relative;
}

:deep(.dv-virtual-list__window) {
  @apply absolute top-0 left-0 right-0;
}

:deep(.dv-row) {
  @apply flex items-center cursor-default whitespace-nowrap overflow-hidden pr-2;
}

:deep(.dv-row:hover) {
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 6%, transparent);
}

:deep(.dv-row--match) {
  background: color-mix(in srgb, #e5a500 12%, transparent);
}

:deep(.dv-row--active-match) {
  @apply outline outline-1;
  background: color-mix(in srgb, #e5a500 28%, transparent);
  outline-color: color-mix(in srgb, #e5a500 80%, transparent);
}

:deep(.dv-row--copied) {
  animation: dv-copy-flash 1.2s ease-out forwards;
}

@keyframes dv-copy-flash {
  0% { background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 25%, transparent); }
  40% { background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 18%, transparent); }
  100% { background: transparent; }
}

:deep(.dv-row__line-number) {
  @apply text-xs min-w-9 pr-2 text-right select-none flex-shrink-0;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 30%, transparent);
}

:deep(.dv-row__indent) {
  @apply flex-shrink-0;
}

:deep(.dv-row__toggle) {
  @apply inline-flex items-center justify-center bg-none border-none cursor-pointer text-sm px-1 flex-shrink-0 leading-none;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 45%, transparent);
}

:deep(.dv-row__toggle:hover) {
  color: var(--dv-fg, #cdd6f4);
}

:deep(.dv-row__toggle-placeholder) {
  @apply inline-block w-5 flex-shrink-0;
}

:deep(.dv-node-value) {
  @apply inline-flex items-center gap-1 overflow-hidden min-w-0;
}

:deep(.dv-node-value__shiki) {
  @apply inline overflow-hidden;
}

:deep(.dv-node-value__shiki span) {
  font: inherit;
}

:deep(.dv-node-value__raw) {
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 80%, transparent);
}

:deep(.dv-node-value__bracket) {
  color: var(--dv-fg, #cdd6f4);
}

:deep(.dv-node-value__key-text) {
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 85%, transparent);
}

:deep(.dv-node-value__colon) {
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 45%, transparent);
}

:deep(.dv-node-value__dash) {
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 45%, transparent);
  flex-shrink: 0;
}

:deep(.dv-node-value__tag) {
  color: color-mix(in srgb, #89b4fa 85%, var(--dv-fg, #cdd6f4) 15%);
  flex-shrink: 0;
}

:deep(.dv-node-value__tag--closing) {
  color: color-mix(in srgb, #89b4fa 55%, var(--dv-fg, #cdd6f4) 45%);
}

:deep(.dv-node-value__attr-name) {
  color: color-mix(in srgb, #fab387 85%, var(--dv-fg, #cdd6f4) 15%);
}

:deep(.dv-node-value__badge) {
  @apply text-xs flex-shrink-0;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 45%, transparent);
}

:deep(.dv-breadcrumb) {
  @apply flex items-center gap-0.5 px-2 flex-shrink-0 flex-wrap text-xs border-t border-t-solid;
  background: color-mix(in srgb, var(--dv-bg, #1e1e2e) 90%, #000 10%);
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 15%, transparent);
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 50%, transparent);
}

:deep(.dv-breadcrumb__segment) {
  @apply bg-none border-none cursor-pointer font-inherit text-xs px-0.5;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 85%, transparent);
}

:deep(.dv-breadcrumb__segment:hover) {
  @apply underline;
}

:deep(.dv-breadcrumb__sep),
:deep(.dv-breadcrumb__empty) {
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 25%, transparent);
}

:deep(.dv-node-toolbar) {
  @apply flex items-center gap-px flex-shrink-0 opacity-0 pointer-events-none transition-opacity duration-100 ml-1.5;
}

:deep(.dv-row:hover .dv-node-toolbar) {
  @apply opacity-100 pointer-events-auto;
}

:deep(.dv-node-toolbar__btn) {
  @apply inline-flex items-center justify-center bg-none border border-solid border-transparent rounded-[3px] cursor-pointer text-xs leading-none px-1 py-0.5 whitespace-nowrap;
  color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 70%, transparent);
}

:deep(.dv-node-toolbar__btn:hover) {
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 12%, transparent);
  border-color: color-mix(in srgb, var(--dv-fg, #cdd6f4) 25%, transparent);
  color: var(--dv-fg, #cdd6f4);
}

:deep(.dv-node-toolbar__level) {
  @apply min-w-4.5 text-center px-0.75 py-0.25;
}

:deep(.dv-node-toolbar__sep) {
  @apply w-px h-3 mx-0.5 flex-shrink-0;
  background: color-mix(in srgb, var(--dv-fg, #cdd6f4) 20%, transparent);
}

@keyframes dv-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
