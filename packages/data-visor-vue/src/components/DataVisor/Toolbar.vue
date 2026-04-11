<script setup lang="ts">
import { ref } from 'vue'
import type { ViewerDisplayMode, ViewerLang } from '../../types/tree'
import LevelPicker from './LevelPicker.vue'

const props = defineProps<{
  isAwaitingChord: boolean
  displayMode: ViewerDisplayMode
  lang: ViewerLang
  /** When true, expand / collapse / depth / search are inactive (minified / fractured view). */
  treeActionsDisabled: boolean
}>()

const emit = defineEmits<{
  expandAll: []
  collapseAll: []
  expandToDepth: [depth: number]
  toggleSearch: []
  copy: []
  'update:displayMode': [mode: ViewerDisplayMode]
}>()

const copied = ref(false)
const tooltipStyle = ref<{ left: string; top: string } | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

function handleCopy(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  tooltipStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top}px`,
  }
  emit('copy')
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
    tooltipStyle.value = null
  }, 1200)
}

function setDisplayMode(mode: ViewerDisplayMode) {
  emit('update:displayMode', mode)
}
</script>

<template>
  <div class="dv-toolbar" role="toolbar" aria-label="Viewer controls">
    <button
      class="dv-toolbar__btn"
      type="button"
      title="Expand all (CTRL+] or CTRL+SHIFT++)"
      :disabled="props.treeActionsDisabled"
      @click="emit('expandAll')"
    >
      <span class="dv-ico dv-ico--unfold-more-horizontal" aria-hidden="true" />
    </button>
    <button
      class="dv-toolbar__btn"
      type="button"
      title="Collapse all (CTRL+[ or CTRL+SHIFT+-)"
      :disabled="props.treeActionsDisabled"
      @click="emit('collapseAll')"
    >
      <span class="dv-ico dv-ico--unfold-less-horizontal" aria-hidden="true" />
    </button>

    <span class="dv-toolbar__separator" />

    <LevelPicker :disabled="props.treeActionsDisabled" @select="emit('expandToDepth', $event)" />

    <span class="dv-toolbar__separator" />

    <button
      class="dv-toolbar__btn"
      type="button"
      title="Search (CTRL+F)"
      :disabled="props.treeActionsDisabled"
      @click="emit('toggleSearch')"
    >
      <span class="dv-ico dv-ico--magnify" aria-hidden="true" />
    </button>

    <span class="dv-toolbar__separator" />

    <div
      class="dv-toolbar__segment"
      role="radiogroup"
      aria-label="Display mode"
    >
      <button
        type="button"
        class="dv-toolbar__segment-btn"
        role="radio"
        :aria-checked="props.displayMode === 'tree'"
        :class="{ 'dv-toolbar__segment-btn--on': props.displayMode === 'tree' }"
        @click="setDisplayMode('tree')"
      >
        Tree
      </button>
      <button
        v-if="props.lang === 'json'"
        type="button"
        class="dv-toolbar__segment-btn"
        role="radio"
        :aria-checked="props.displayMode === 'fractured'"
        :class="{ 'dv-toolbar__segment-btn--on': props.displayMode === 'fractured' }"
        @click="setDisplayMode('fractured')"
      >
        Fractured
      </button>

      <button
        type="button"
        class="dv-toolbar__segment-btn"
        role="radio"
        :aria-checked="props.displayMode === 'minified'"
        :class="{ 'dv-toolbar__segment-btn--on': props.displayMode === 'minified' }"
        @click="setDisplayMode('minified')"
      >
        Minified
      </button>
    </div>

    <span class="dv-toolbar__separator" />

    <button class="dv-toolbar__btn" type="button" title="Copy" @click="handleCopy">
      <span class="dv-ico dv-ico--content-copy" aria-hidden="true" />
    </button>

    <span
      v-if="props.isAwaitingChord"
      class="dv-toolbar__chord-hint"
      role="status"
      aria-live="polite"
    >
      CTRL+SHIFT+* · enter level (0–9)
    </span>
  </div>

  <Teleport to="body">
    <Transition name="dv-tooltip">
      <span
        v-if="copied && tooltipStyle"
        class="dv-copy-tooltip"
        :style="tooltipStyle"
      >Copied!</span>
    </Transition>
  </Teleport>
</template>
