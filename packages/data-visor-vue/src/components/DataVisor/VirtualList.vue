<script setup lang="ts">
import { inject } from 'vue'
import type { TreeNode } from '../../types/tree'
import { VIEWER_KEY } from './injectionKey'
import ViewerRow from './ViewerRow.vue'

const props = defineProps<{
  visibleSlice: TreeNode[]
  allVisibleNodes: TreeNode[]
  totalHeight: number
  offsetY: number
  containerRef: (el: unknown) => void
  showLineNumbers: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  nodeClick: [node: TreeNode]
  nodeHover: [node: TreeNode | null]
}>()

const ctx = inject(VIEWER_KEY)!
</script>

<template>
  <div
    :ref="props.containerRef"
    class="dv-virtual-list"
  >
    <div class="dv-virtual-list__spacer" :style="{ height: `${props.totalHeight}px` }">
      <div
        class="dv-virtual-list__window"
        :style="{ transform: `translateY(${props.offsetY}px)` }"
      >
        <ViewerRow
          v-for="node in props.visibleSlice"
          :key="node.id"
          :node="node"
          :line-number="props.allVisibleNodes.indexOf(node) + 1"
          :show-line-numbers="props.showLineNumbers"
          @toggle="(id) => { ctx.expansion.toggle(id); emit('toggle', id) }"
          @click="emit('nodeClick', node)"
          @hover="emit('nodeHover', $event)"
        />
      </div>
    </div>
  </div>
</template>
