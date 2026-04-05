<script setup lang="ts">
import type { ShikiTheme, ViewerLang } from 'data-visor-vue'
import { bundledThemesInfo } from 'shiki'
import { computed } from 'vue'

defineProps<{
  lang: ViewerLang
}>()

const emit = defineEmits<{
  'lang-change': [lang: ViewerLang]
}>()

const showLineNumbers = defineModel<boolean>('showLineNumbers', { required: true })
const showToolbar = defineModel<boolean>('showToolbar', { required: true })
const showBreadcrumb = defineModel<boolean>('showBreadcrumb', { required: true })
const darkTheme = defineModel<ShikiTheme>('darkTheme', { required: true })
const lightTheme = defineModel<ShikiTheme>('lightTheme', { required: true })

const darkThemes = computed(() => bundledThemesInfo.filter((t) => t.type === 'dark'))
const lightThemes = computed(() => bundledThemesInfo.filter((t) => t.type === 'light'))
</script>

<template>
  <header class="px-4 py-2.5 border-b border-pg-border bg-pg-surface flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex flex-col gap-1">
        <span class="text-[9px] font-bold uppercase tracking-wider text-pg-muted leading-none">Language</span>
        <div class="flex bg-pg-inputBg rounded p-0.5 border border-pg-inputBorder">
          <button
            v-for="l in (['json', 'yaml', 'xml'] as ViewerLang[])"
            :key="l"
            class="px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
            :class="lang === l ? 'bg-pg-btnActiveBg text-pg-btnActiveFg shadow-sm' : 'text-pg-fg hover:bg-pg-inputBorder/50'"
            @click="emit('lang-change', l)"
          >
            {{ l.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[9px] font-bold uppercase tracking-wider text-pg-muted leading-none">Settings</span>
        <div class="flex items-center gap-3 text-[11px]">
          <label class="flex items-center gap-1.5 cursor-pointer hover:text-pg-accent transition-colors">
            <input v-model="showLineNumbers" type="checkbox" class="accent-pg-accent" /> Lines
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer hover:text-pg-accent transition-colors">
            <input v-model="showToolbar" type="checkbox" class="accent-pg-accent" /> Toolbar
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer hover:text-pg-accent transition-colors">
            <input v-model="showBreadcrumb" type="checkbox" class="accent-pg-accent" /> Path
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[9px] font-bold uppercase tracking-wider text-pg-muted leading-none">Light Theme</span>
        <select v-model="lightTheme" class="input-base w-36 cursor-pointer" title="Light theme">
          <optgroup label="Light">
            <option v-for="t in lightThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
          <optgroup label="Dark">
            <option v-for="t in darkThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[9px] font-bold uppercase tracking-wider text-pg-muted leading-none">Dark Theme</span>
        <select v-model="darkTheme" class="input-base w-36 cursor-pointer" title="Dark theme">
          <optgroup label="Dark">
            <option v-for="t in darkThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
          <optgroup label="Light">
            <option v-for="t in lightThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
        </select>
      </div>
    </div>
  </header>
</template>
