<script setup lang="ts">
import { computed } from 'vue'
import type { TreeNode } from '../../types/tree'
import { pathToSegments } from '../../utils/path'

const props = defineProps<{
  node: TreeNode | null
}>()

const emit = defineEmits<{
  segmentClick: [path: string]
}>()

const segments = computed(() => {
  if (!props.node) return []
  const segs = pathToSegments(props.node.path)
  const result: Array<{ label: string; path: string }> = [{ label: '$', path: '$' }]
  let current = '$'
  for (const seg of segs) {
    current = typeof seg === 'number' ? `${current}[${seg}]` : `${current}.${seg}`
    result.push({ label: String(seg), path: current })
  }
  return result
})
</script>

<template>
  <div class="dv-breadcrumb" aria-label="Node path">
    <template v-if="props.node">
      <template v-for="(seg, i) in segments" :key="seg.path">
        <span v-if="i > 0" class="dv-breadcrumb__sep dv-ico dv-ico--chevron-right" aria-hidden="true" />
        <button
          class="dv-breadcrumb__segment"
          @click="emit('segmentClick', seg.path)"
        >
          {{ seg.label }}
        </button>
      </template>
    </template>
    <div v-else>
      <span class="dv-breadcrumb__empty dv-ico dv-ico--minus" aria-hidden="true">&nbsp;</span>
    </div>
  </div>
</template>
