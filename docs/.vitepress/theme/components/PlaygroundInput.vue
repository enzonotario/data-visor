<script setup lang="ts">
import type { ViewerLang } from 'data-visor-vue'

defineProps<{
  lang: ViewerLang
}>()

const content = defineModel<string>({ required: true })

function onInput(event: Event) {
  content.value = (event.target as HTMLTextAreaElement).value
}
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden p-1">
    <div class="text-[10px] font-bold uppercase tracking-widest text-pg-muted">
      <span>Input ({{ lang.toUpperCase() }})</span>
    </div>
    <textarea
      class="flex-1 p-4 bg-pg-inputBg text-pg-fg font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-pg-accent/30 transition-shadow rounded"
      :value="content"
      :placeholder="`Paste ${lang.toUpperCase()} here…`"
      spellcheck="false"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  @apply bg-pg-border rounded;
}
textarea::-webkit-scrollbar-thumb:hover {
  @apply bg-pg-muted;
}
</style>
