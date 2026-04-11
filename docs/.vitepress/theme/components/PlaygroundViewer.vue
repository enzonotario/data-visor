<script setup lang="ts">
import type { ShikiTheme, ViewerDisplayMode, ViewerLang } from 'data-visor-vue'
import DataVisor from '../../../../packages/data-visor-vue/src/components/DataVisor/DataVisor.vue'

defineProps<{
  data: string
  lang: ViewerLang
  darkTheme: ShikiTheme
  lightTheme: ShikiTheme
  isDark: boolean
  initialDepth: number
  showLineNumbers: boolean
  showToolbar: boolean
  showBreadcrumb: boolean
}>()

const viewerMode = defineModel<ViewerDisplayMode>('viewerMode', { required: true })
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden p-1 min-w-0">
    <div class="text-[10px] font-bold uppercase tracking-widest text-pg-muted mb-1">Viewer</div>
    <div class="flex-1 overflow-auto relative min-h-0">
      <DataVisor
        v-model:display-mode="viewerMode"
        :data="data"
        :lang="lang"
        :dark-theme="darkTheme"
        :light-theme="lightTheme"
        :is-dark="isDark"
        :max-height="'100%'"
        :initial-depth="initialDepth"
        :show-line-numbers="showLineNumbers"
        :show-toolbar="showToolbar"
        :show-breadcrumb="showBreadcrumb"
        class="h-full"
      />
    </div>
  </div>
</template>
