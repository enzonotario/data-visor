<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { usePlayground } from '../composables/usePlayground'
import PlaygroundHeader from './PlaygroundHeader.vue'
import PlaygroundInput from './PlaygroundInput.vue'
import PlaygroundViewer from './PlaygroundViewer.vue'

const {
  lang,
  showLineNumbers,
  showToolbar,
  showBreadcrumb,
  initialDepth,
  darkTheme,
  lightTheme,
  currentContent,
  onLangChange,
} = usePlayground()

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})
</script>

<template>
  <div class="my-8 border border-[var(--vp-c-divider)] rounded-lg overflow-hidden shadow-sm">
    <div
      class="flex flex-col h-[70vh] font-sans bg-pg-bg text-pg-fg"
      :data-mode="isDark ? 'dark' : 'light'"
    >
      <PlaygroundHeader
        :lang="lang"
        v-model:show-line-numbers="showLineNumbers"
        v-model:show-toolbar="showToolbar"
        v-model:show-breadcrumb="showBreadcrumb"
        v-model:dark-theme="darkTheme"
        v-model:light-theme="lightTheme"
        @lang-change="onLangChange"
      />

      <div class="flex flex-1 overflow-hidden p-3 gap-3">
        <PlaygroundInput
          v-model="currentContent"
          :lang="lang"
        />

        <PlaygroundViewer
          :data="currentContent"
          :lang="lang"
          :dark-theme="darkTheme"
          :light-theme="lightTheme"
          :is-dark="isDark"
          :initial-depth="initialDepth"
          :show-line-numbers="showLineNumbers"
          :show-toolbar="showToolbar"
          :show-breadcrumb="showBreadcrumb"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
[data-mode="dark"] {
  --pg-bg: #1e1e2e;
  --pg-surface: #181825;
  --pg-border: #313244;
  --pg-fg: #cdd6f4;
  --pg-muted: #6c7086;
  --pg-accent: #89b4fa;
  --pg-input-bg: #11111b;
  --pg-input-border: #45475a;
  --pg-btn-bg: #313244;
  --pg-btn-active-bg: #89b4fa;
  --pg-btn-active-fg: #11111b;
  --pg-dt: #cba6f7;
  --pg-dd: #a6adc8;
}

[data-mode="light"] {
  --pg-bg: #f8f9fa;
  --pg-surface: #ffffff;
  --pg-border: #dee2e6;
  --pg-fg: #212529;
  --pg-muted: #6c757d;
  --pg-accent: #0d6efd;
  --pg-input-bg: #ffffff;
  --pg-input-border: #ced4da;
  --pg-btn-bg: #e9ecef;
  --pg-btn-active-bg: #0d6efd;
  --pg-btn-active-fg: #ffffff;
  --pg-dt: #6f42c1;
  --pg-dd: #495057;
}
</style>
