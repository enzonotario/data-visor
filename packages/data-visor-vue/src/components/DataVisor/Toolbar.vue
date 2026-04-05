<script setup lang="ts">
import { ref } from 'vue'
import LevelPicker from './LevelPicker.vue'

const props = defineProps<{
  isAwaitingChord: boolean
}>()

const emit = defineEmits<{
  expandAll: []
  collapseAll: []
  expandToDepth: [depth: number]
  toggleSearch: []
  copy: []
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
</script>

<template>
  <div class="dv-toolbar" role="toolbar" aria-label="Viewer controls">
    <button
      class="dv-toolbar__btn"
      title="Expand all (CTRL+] or CTRL+SHIFT++)"
      @click="emit('expandAll')"
    >
      <span class="dv-ico dv-ico--unfold-more-horizontal" aria-hidden="true" />
    </button>
    <button
      class="dv-toolbar__btn"
      title="Collapse all (CTRL+[ or CTRL+SHIFT+-)"
      @click="emit('collapseAll')"
    >
      <span class="dv-ico dv-ico--unfold-less-horizontal" aria-hidden="true" />
    </button>

    <span class="dv-toolbar__separator" />

    <LevelPicker @select="emit('expandToDepth', $event)" />

    <span class="dv-toolbar__separator" />

    <button
      class="dv-toolbar__btn"
      title="Search (CTRL+F)"
      @click="emit('toggleSearch')"
    >
      <span class="dv-ico dv-ico--magnify" aria-hidden="true" />
    </button>

    <span class="dv-toolbar__separator" />

    <button class="dv-toolbar__btn" title="Copy" @click="handleCopy">
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
