<script setup lang="ts">
import { computed, inject } from 'vue'
import type { TreeNode } from '../../types/tree'
import { pathToSegments } from '../../utils/path'
import { VIEWER_KEY } from './injectionKey'

const props = defineProps<{
  node: TreeNode
  highlightedHtml: string
  isMatch: boolean
  isActiveMatch: boolean
  isExpanded: boolean
}>()

const ctx = inject(VIEWER_KEY)!

const isJson = computed(() => ctx.lang.value === 'json')
const isYaml = computed(() => ctx.lang.value === 'yaml')
const isXml = computed(() => ctx.lang.value === 'xml')

const nodeContext = computed(() => {
  const { node } = props
  const key = node.key
  const keyStr = String(key)

  if (node.isClosing) return 'closing'

  if (isXml.value) {
    if (typeof key === 'number') return 'xml-array-item'
    if (key === '#text' || key === '#cdata') return 'xml-text'
    if (typeof key === 'string' && keyStr.startsWith('@_')) return 'xml-attribute'
    if (node.isCollapsible && typeof key === 'string') return 'xml-element-open'
    if (!node.isCollapsible && key !== undefined) return 'xml-element-inline'
  }

  if (isYaml.value && typeof key === 'number') return 'yaml-array-item'

  return 'default'
})

function xmlTagName(node: TreeNode): string {
  if (typeof node.key === 'string' && !node.key.startsWith('@_')) return node.key
  const segs = pathToSegments(node.path)
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i]
    if (typeof s === 'string' && !s.startsWith('@_')) return s
  }
  return 'node'
}

function keyText(node: TreeNode): string {
  if (typeof node.key === 'number') return String(node.key)
  if (isJson.value) return `"${node.key}"`
  const k = String(node.key)
  return k.startsWith('@_') ? k.slice(2) : k
}

function openingBracket(node: TreeNode): string {
  return node.type === 'array' ? '[' : '{'
}

function closingBracket(node: TreeNode): string {
  return node.type === 'array' ? ']' : '}'
}

function collapsedBadge(node: TreeNode): string {
  return node.type === 'array' ? `[${node.childCount}]` : `{${node.childCount}}`
}

function rawValue(node: TreeNode): string {
  if (node.type === 'string') return isJson.value ? `"${node.value}"` : String(node.value)
  if (node.value === null) return isJson.value ? 'null' : '~'
  if (typeof node.value === 'object') return ''
  return String(node.value)
}
</script>

<template>
  <span
    class="dv-node-value"
    :class="{
      'dv-node-value--match': props.isMatch,
      'dv-node-value--active-match': props.isActiveMatch,
    }"
  >
    <span
      v-if="props.highlightedHtml && isJson"
      class="dv-node-value__shiki"
      v-html="props.highlightedHtml"
    />

    <template v-else-if="nodeContext === 'closing'">
      <span v-if="isJson" class="dv-node-value__bracket">{{ closingBracket(props.node) }}</span>
      <span v-else-if="isXml && props.node.path !== '$'" class="dv-node-value__tag dv-node-value__tag--closing">
        &lt;/{{ xmlTagName(props.node) }}&gt;
      </span>
    </template>

    <template v-else-if="nodeContext === 'yaml-array-item'">
      <span class="dv-node-value__dash">-&thinsp;</span>
      <span class="dv-node-value__raw">{{ rawValue(props.node) }}</span>
    </template>

    <template v-else-if="nodeContext === 'xml-array-item'">
      <span class="dv-node-value__tag">&lt;{{ xmlTagName(props.node) }}&gt;</span>
      <span class="dv-node-value__raw">{{ rawValue(props.node) }}</span>
    </template>

    <template v-else-if="nodeContext === 'xml-element-open'">
      <span class="dv-node-value__tag">&lt;{{ keyText(props.node) }}&gt;</span>
    </template>

    <template v-else-if="nodeContext === 'xml-attribute'">
      <span class="dv-node-value__attr">
        <span class="dv-node-value__attr-name">{{ keyText(props.node) }}</span>
        <span class="dv-node-value__colon">=&thinsp;</span>
      </span>
      <span class="dv-node-value__raw">{{ rawValue(props.node) }}</span>
    </template>

    <template v-else-if="nodeContext === 'xml-text'">
      <span class="dv-node-value__raw">{{ rawValue(props.node) }}</span>
    </template>

    <template v-else-if="nodeContext === 'xml-element-inline'">
      <span class="dv-node-value__tag">&lt;{{ xmlTagName(props.node) }}&gt;</span>
      <span class="dv-node-value__raw">{{ rawValue(props.node) }}</span>
      <span class="dv-node-value__tag dv-node-value__tag--closing">&lt;/{{ xmlTagName(props.node) }}&gt;</span>
    </template>

    <template v-else>
      <span v-if="props.node.key !== undefined" class="dv-node-value__key">
        <span class="dv-node-value__key-text">{{ keyText(props.node) }}</span>
        <span class="dv-node-value__colon">:&thinsp;</span>
      </span>
      <span v-if="props.node.isCollapsible && isJson" class="dv-node-value__bracket">
        {{ openingBracket(props.node) }}
      </span>
      <span v-else-if="!props.node.isCollapsible" class="dv-node-value__raw">
        {{ rawValue(props.node) }}
      </span>
    </template>

    <span
      v-if="props.node.isCollapsible && !props.isExpanded"
      class="dv-node-value__badge"
    >
      {{ collapsedBadge(props.node) }}
    </span>
  </span>
</template>
