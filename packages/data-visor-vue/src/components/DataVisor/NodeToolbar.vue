<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { TreeNode } from '../../types/tree'
import { VIEWER_KEY } from './injectionKey'
import LevelPicker from './LevelPicker.vue'

const props = defineProps<{ node: TreeNode }>()
const ctx = inject(VIEWER_KEY)!

const subtreeSearchEnabled = computed(() => ctx.isTreeDisplayMode?.value ?? true)

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
  ctx.copyNode(props.node.value, props.node.path)
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
    tooltipStyle.value = null
  }, 1200)
}
</script>

<template>
  <div class="dv-node-toolbar" @click.stop>
    <button
      class="dv-node-toolbar__btn"
      title="Expand subtree"
      @click="ctx.expandSubtree(props.node.path)"
    >
      <span class="dv-ico dv-ico--unfold-more-horizontal" aria-hidden="true" />
    </button>
    <button
      class="dv-node-toolbar__btn"
      title="Collapse subtree"
      @click="ctx.collapseSubtree(props.node.path)"
    >
      <span class="dv-ico dv-ico--unfold-less-horizontal" aria-hidden="true" />
    </button>
    <span class="dv-node-toolbar__sep" />
    <LevelPicker @select="ctx.expandSubtreeToDepth(props.node.path, props.node.depth, $event)" />
    <span class="dv-node-toolbar__sep" />
    <button
      class="dv-node-toolbar__btn"
      title="Search within"
      :disabled="!subtreeSearchEnabled"
      @click="ctx.openSearchWithScope(props.node.path, $event.currentTarget as HTMLElement)"
    >
      <span class="dv-ico dv-ico--magnify" aria-hidden="true" />
    </button>
    <button
      class="dv-node-toolbar__btn"
      title="Copy"
      @click="handleCopy"
    >
      <span class="dv-ico dv-ico--content-copy" aria-hidden="true" />
    </button>
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

<style>
.dv-copy-tooltip {
  position: fixed;
  transform: translateX(-50%) translateY(calc(-100% - 6px));
  background: #2a2a3a;
  color: #cdd6f4;
  border: 1px solid rgba(205, 214, 244, 0.3);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
}

.dv-tooltip-enter-active,
.dv-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dv-tooltip-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(calc(-100% - 2px));
}

.dv-tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(calc(-100% - 2px));
}
</style>
