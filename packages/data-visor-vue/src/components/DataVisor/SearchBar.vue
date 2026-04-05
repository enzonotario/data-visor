<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  query: string
  matchCount: number
  activeIndex: number
  hasMatches: boolean
  scopePath?: string | null
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  next: []
  prev: []
  close: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const onInput = useDebounceFn((e: Event) => {
  emit('update:query', (e.target as HTMLInputElement).value)
}, 150)

function focus() {
  inputRef.value?.focus()
}

function onSearchEnter(e: KeyboardEvent) {
  e.preventDefault()
  if (e.shiftKey) emit('prev')
  else emit('next')
}

defineExpose({ focus })
</script>

<template>
  <div class="dv-search-bar" role="search">
    <span v-if="props.scopePath" class="dv-search-bar__scope" :title="props.scopePath">
      {{ props.scopePath }}
    </span>
    <input
      ref="inputRef"
      class="dv-search-bar__input"
      type="text"
      :placeholder="props.scopePath ? 'Search within…' : 'Search… (prefix $ for path)'"
      :value="props.query"
      aria-label="Search"
      @input="onInput"
      @keydown.enter="onSearchEnter"
      @keydown.escape.prevent="emit('close')"
    />
    <span class="dv-search-bar__count" aria-live="polite">
      <template v-if="props.query && !props.hasMatches">No results</template>
      <template v-else-if="props.hasMatches">
        {{ props.activeIndex + 1 }} / {{ props.matchCount }}
      </template>
    </span>
    <button class="dv-search-bar__nav" :disabled="!props.hasMatches" aria-label="Previous result" @click="emit('prev')">
      <span class="dv-ico dv-ico--chevron-up" aria-hidden="true" />
    </button>
    <button class="dv-search-bar__nav" :disabled="!props.hasMatches" aria-label="Next result" @click="emit('next')">
      <span class="dv-ico dv-ico--chevron-down" aria-hidden="true" />
    </button>
    <button class="dv-search-bar__close" aria-label="Close search" @click="emit('close')">
      <span class="dv-ico dv-ico--close" aria-hidden="true" />
    </button>
  </div>
</template>
