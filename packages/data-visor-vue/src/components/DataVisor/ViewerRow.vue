<script setup lang="ts">
import { inject } from 'vue'
import { ROW_HEIGHT } from '../../composables/useVirtualScroll'
import type { TreeNode } from '../../types/tree'
import { VIEWER_KEY } from './injectionKey'
import NodeToolbar from './NodeToolbar.vue'
import NodeValue from './NodeValue.vue'

const props = defineProps<{
  node: TreeNode
  lineNumber?: number
  showLineNumbers: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  click: [node: TreeNode]
  hover: [node: TreeNode | null]
}>()

const ctx = inject(VIEWER_KEY)!

const INDENT = 16
</script>

<template>
  <div
    class="dv-row"
    :class="{
      'dv-row--match': ctx.search.isMatch(props.node.id),
      'dv-row--active-match': ctx.search.isActiveMatch(props.node.id),
      'dv-row--copied': ctx.copiedNodePath.value !== null && (props.node.path === ctx.copiedNodePath.value || props.node.path.startsWith(ctx.copiedNodePath.value + '.') || props.node.path.startsWith(ctx.copiedNodePath.value + '[')),
    }"
    :style="{ height: `${ROW_HEIGHT}px` }"
    @click="emit('click', props.node)"
    @mouseenter="emit('hover', props.node)"
    @mouseleave="emit('hover', null)"
  >
    <span v-if="props.showLineNumbers" class="dv-row__line-number">
      {{ props.lineNumber }}
    </span>

    <span class="dv-row__indent" :style="{ width: `${props.node.depth * INDENT}px` }" />

    <button
      v-if="props.node.isCollapsible"
      class="dv-row__toggle"
      :aria-expanded="ctx.expansion.isExpanded(props.node.id)"
      :aria-label="ctx.expansion.isExpanded(props.node.id) ? 'Collapse' : 'Expand'"
      @click.stop="emit('toggle', props.node.id)"
    >
      <span
        v-if="ctx.expansion.isExpanded(props.node.id)"
        class="dv-ico dv-ico--chevron-down"
        aria-hidden="true"
      />
      <span v-else class="dv-ico dv-ico--chevron-right" aria-hidden="true" />
    </button>
    <span v-else class="dv-row__toggle-placeholder" />

    <template v-if="props.node.isCollapsible">
      <span class="flex items-center flex-1 min-w-0 overflow-hidden">
        <NodeValue
          class="flex-[0_1_auto] overflow-hidden min-w-0"
          :node="props.node"
          :highlighted-html="ctx.tokenMap.value.get(props.node.id) ?? ''"
          :is-match="ctx.search.isMatch(props.node.id)"
          :is-active-match="ctx.search.isActiveMatch(props.node.id)"
          :is-expanded="ctx.expansion.isExpanded(props.node.id)"
        />
        <NodeToolbar :node="props.node" />
      </span>
    </template>
    <NodeValue
      v-else
      class="flex-1 overflow-hidden min-w-0"
      :node="props.node"
      :highlighted-html="ctx.tokenMap.value.get(props.node.id) ?? ''"
      :is-match="ctx.search.isMatch(props.node.id)"
      :is-active-match="ctx.search.isActiveMatch(props.node.id)"
      :is-expanded="ctx.expansion.isExpanded(props.node.id)"
    />
  </div>
</template>
