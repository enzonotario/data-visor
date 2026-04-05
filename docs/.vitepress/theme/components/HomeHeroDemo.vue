<script setup lang="ts">
import { useFocusWithin, useIntervalFn } from '@vueuse/core'
import type { ShikiTheme } from 'data-visor-vue'
import { DataVisor } from 'data-visor-vue'
import { bundledThemesInfo } from 'shiki'
import { useData } from 'vitepress'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

const CYCLE_MS = 4500

const demoData = JSON.stringify({
  name: 'Data Visor',
  supportedFormats: ['JSON', 'YAML', 'XML'],
  features: { highlighting: 'Shiki', shortcuts: 'Yes', darkMode: 'Yes' },
})

const { isDark } = useData()

const lightThemes = computed(() => bundledThemesInfo.filter((t) => t.type === 'light'))
const darkThemes = computed(() => bundledThemesInfo.filter((t) => t.type === 'dark'))

const lightIds = computed(() => lightThemes.value.map((t) => t.id))
const darkIds = computed(() => darkThemes.value.map((t) => t.id))

function pickOrFirst(list: string[], preferred: string): string {
  return list.includes(preferred) ? preferred : (list[0] ?? preferred)
}

const lightThemeId = ref('')
const darkThemeId = ref('')

const client = ref(false)
const toolbarRef = useTemplateRef('toolbarRef')
const { focused: toolbarFocused } = useFocusWithin(toolbarRef)

let step = 0
const { pause, resume } = useIntervalFn(
  () => {
    const lights = lightIds.value
    const darks = darkIds.value
    if (!lights.length || !darks.length) return
    if (step % 2 === 0) {
      const i = lights.indexOf(lightThemeId.value)
      lightThemeId.value = lights[(i + 1) % lights.length] ?? lightThemeId.value
    } else {
      const i = darks.indexOf(darkThemeId.value)
      darkThemeId.value = darks[(i + 1) % darks.length] ?? darkThemeId.value
    }
    step++
  },
  CYCLE_MS,
  { immediate: false },
)

watch(toolbarFocused, (f) => {
  if (f) pause()
  else resume()
})

onMounted(() => {
  lightThemeId.value = pickOrFirst(lightIds.value, 'material-theme-lighter')
  darkThemeId.value = pickOrFirst(darkIds.value, 'material-theme')
  client.value = true
  resume()
})
</script>

<template>
  <div class="home-hero-demo">
    <div ref="toolbarRef" class="home-hero-demo__toolbar">
      <div class="home-hero-demo__field">
        <label class="home-hero-demo__label" for="home-demo-light-theme">Light theme</label>
        <select
          id="home-demo-light-theme"
          v-model="lightThemeId"
          class="home-hero-demo__select"
          title="Light Shiki theme"
        >
          <optgroup label="Light">
            <option v-for="t in lightThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
          <optgroup label="Dark">
            <option v-for="t in darkThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
        </select>
      </div>
      <div class="home-hero-demo__field">
        <label class="home-hero-demo__label" for="home-demo-dark-theme">Dark theme</label>
        <select
          id="home-demo-dark-theme"
          v-model="darkThemeId"
          class="home-hero-demo__select"
          title="Dark Shiki theme"
        >
          <optgroup label="Dark">
            <option v-for="t in darkThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
          <optgroup label="Light">
            <option v-for="t in lightThemes" :key="t.id" :value="t.id">{{ t.displayName }}</option>
          </optgroup>
        </select>
      </div>
    </div>

    <DataVisor
      v-if="client && lightThemeId && darkThemeId"
      :data="demoData"
      :light-theme="lightThemeId as ShikiTheme"
      :dark-theme="darkThemeId as ShikiTheme"
      :is-dark="isDark"
      min-height="260px"
      max-height="380px"
      class="home-hero-demo__visor w-full"
    />
    <div v-else class="home-hero-demo__placeholder" aria-hidden="true" />
  </div>
</template>

<style scoped>
.home-hero-demo {
  position: relative;
  z-index: 2;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.home-hero-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: flex-end;
}

.home-hero-demo__field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1 1 140px;
}

.home-hero-demo__label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.home-hero-demo__select {
  width: 100%;
  max-width: 220px;
  font-size: 0.75rem;
  line-height: 1.3;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.home-hero-demo__select:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.home-hero-demo__visor {
  max-width: 100%;
}

.home-hero-demo__placeholder {
  min-height: 260px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--vp-c-text-1) 12%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent);
}
</style>
