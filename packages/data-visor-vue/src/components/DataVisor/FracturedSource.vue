<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { TreeNode } from '../../types/tree'
import type { FracturedRegion } from '../../utils/fracturedRegions'
import { deepestNodeForLine } from '../../utils/fracturedRegions'

const props = defineProps({
  html: { type: String, required: true },
  regions: { type: Array as PropType<FracturedRegion[]>, required: true },
})

const emit = defineEmits<{
  'hover-node': [node: TreeNode | null]
}>()

/** Match `.dv-source-fractured__inner :deep(pre.shiki .line)` (13px × 1.45). */
const LINE_HEIGHT_PX = 13 * 1.45
const PRE_PADDING_TOP = 12

const htmlContent = computed(() => props.html)

function onMouseMove(e: MouseEvent) {
  const scrollEl = e.currentTarget as HTMLElement
  const pre = scrollEl.querySelector('pre.shiki') as HTMLElement | null
  if (!pre || props.regions.length === 0) {
    emit('hover-node', null)
    return
  }
  const style = getComputedStyle(pre)
  const padTop = Number.parseFloat(style.paddingTop) || PRE_PADDING_TOP
  const padBottom = Number.parseFloat(style.paddingBottom) || PRE_PADDING_TOP
  const rect = pre.getBoundingClientRect()
  const y = e.clientY - rect.top - padTop
  const maxY = pre.clientHeight - padTop - padBottom
  if (y < 0 || y > maxY) {
    emit('hover-node', null)
    return
  }
  const line = Math.max(0, Math.floor(y / LINE_HEIGHT_PX))
  emit('hover-node', deepestNodeForLine(line, props.regions))
}

function onMouseLeave() {
  emit('hover-node', null)
}
</script>

<template>
  <div class="dv-source-fractured">
    <div
      class="dv-source-fractured__scroll"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div class="dv-source-fractured__layer">
        <div class="dv-source-fractured__inner" v-html="htmlContent" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dv-source-fractured {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.dv-source-fractured__scroll {
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  /* Evita que el ancho intrínseco del <pre> ensanche ancestros flex fuera de este nodo */
  contain: inline-size;
}

.dv-source-fractured__layer {
  position: relative;
  width: max-content;
  min-width: 100%;
  box-sizing: border-box;
}

.dv-source-fractured__inner {
  flex: 0 0 auto;
  min-width: min-content;
}

/*
 * Shiki outputs one <span class="line"> per source line but inserts literal newlines in the HTML
 * between those spans. With white-space: pre on <pre>, those become extra blank lines and break
 * FracturedJson alignment. Collapse the inter-node text by zeroing font metrics on <code>.
 */
.dv-source-fractured__inner :deep(pre.shiki) {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-variant-ligatures: none;
  tab-size: 2;
  white-space: pre;
  overflow: visible;
  width: max-content;
  box-sizing: border-box;
  word-break: normal;
  overflow-wrap: normal;
}

.dv-source-fractured__inner :deep(pre.shiki code) {
  display: block;
  font-size: 0;
  line-height: 0;
}

.dv-source-fractured__inner :deep(pre.shiki .line) {
  display: block;
  font-size: 13px;
  line-height: 1.45;
}

.dv-source-fractured__inner :deep(pre.shiki .line span) {
  font-size: inherit;
  line-height: inherit;
}
</style>
