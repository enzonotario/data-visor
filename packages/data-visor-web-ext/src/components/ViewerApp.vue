<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { DataVisor, type ShikiTheme, type ViewerLang } from 'data-visor-vue'
import { bundledThemesInfo } from 'shiki'
import { computed, ref, watch } from 'vue'
import type { UiColorMode } from '@/lib/color-mode-storage'
import { uiColorMode } from '@/lib/color-mode-storage'
import { shikiDarkSyntaxTheme, shikiLightSyntaxTheme } from '@/lib/shiki-theme-storage'
import { BROWSER_NATIVE_HASH } from '@/lib/should-activate'

const props = withDefaults(
  defineProps<{
    fullText: string
    lang: ViewerLang
    href: string
    initialColorMode?: UiColorMode
    initialDarkSyntaxTheme?: ShikiTheme
    initialLightSyntaxTheme?: ShikiTheme
  }>(),
  {
    initialColorMode: 'auto',
    initialDarkSyntaxTheme: 'github-dark',
    initialLightSyntaxTheme: 'github-light',
  },
)

const modeStore = ref<UiColorMode>(props.initialColorMode)

const isDark = useDark({
  storageRef: modeStore,
  initialValue: props.initialColorMode,
})

watch(
  modeStore,
  (v) => {
    void uiColorMode.setValue(v)
  },
  { flush: 'sync' },
)

const darkSyntaxTheme = ref<ShikiTheme>(props.initialDarkSyntaxTheme)
const lightSyntaxTheme = ref<ShikiTheme>(props.initialLightSyntaxTheme)

const shikiDarkOptions = computed(() => bundledThemesInfo.filter((t) => t.type === 'dark'))
const shikiLightOptions = computed(() => bundledThemesInfo.filter((t) => t.type === 'light'))

watch(darkSyntaxTheme, (v) => void shikiDarkSyntaxTheme.setValue(String(v)), { flush: 'sync' })
watch(lightSyntaxTheme, (v) => void shikiLightSyntaxTheme.setValue(String(v)), { flush: 'sync' })

function openBrowserNativeView() {
  try {
    const next = new URL(props.href, window.location.origin)
    next.hash = BROWSER_NATIVE_HASH
    const cur = window.location
    const sameResource =
      next.origin === cur.origin && next.pathname === cur.pathname && next.search === cur.search
    if (sameResource) {
      cur.hash = BROWSER_NATIVE_HASH
      cur.reload()
      return
    }
    window.location.assign(next.toString())
  } catch {
    const base = props.href.split('#')[0]
    window.location.href = `${base}${BROWSER_NATIVE_HASH}`
    window.location.reload()
  }
}

const fileLabel = computed(() => {
  try {
    const seg = new URL(props.href).pathname.split('/').pop() ?? ''
    return decodeURIComponent(seg.split('?')[0] || 'document')
  } catch {
    return 'document'
  }
})

/** Fill flex main; bar height varies when wrapped. */
const visorMax = '100%'
</script>

<template>
  <div class="ext-shell" :class="{ 'ext-shell--light': !isDark }">
    <header class="ext-bar">
      <span class="ext-title">{{ fileLabel }}</span>
      <button
        type="button"
        class="ext-btn"
        :class="{ 'ext-btn--on': modeStore === 'auto' }"
        title="Match system appearance"
        @click="modeStore = 'auto'"
      >
        Auto
      </button>
      <button
        type="button"
        class="ext-btn"
        :class="{ 'ext-btn--on': modeStore === 'dark' }"
        @click="modeStore = 'dark'"
      >
        Dark
      </button>
      <button
        type="button"
        class="ext-btn"
        :class="{ 'ext-btn--on': modeStore === 'light' }"
        @click="modeStore = 'light'"
      >
        Light
      </button>
      <div class="ext-shiki" title="Shiki syntax highlighting">
        <label class="ext-shiki__field">
          <span class="ext-shiki__lbl">Dark</span>
          <select v-model="darkSyntaxTheme" class="ext-select">
            <option v-for="t in shikiDarkOptions" :key="t.id" :value="t.id">
              {{ t.displayName }}
            </option>
          </select>
        </label>
        <label class="ext-shiki__field">
          <span class="ext-shiki__lbl">Light</span>
          <select v-model="lightSyntaxTheme" class="ext-select">
            <option v-for="t in shikiLightOptions" :key="t.id" :value="t.id">
              {{ t.displayName }}
            </option>
          </select>
        </label>
      </div>
      <button
        type="button"
        class="ext-btn"
        title="Browser default view for this file"
        @click="openBrowserNativeView"
      >
        Raw
      </button>
    </header>
    <main class="ext-main">
      <DataVisor
        :data="fullText"
        :lang="lang"
        :is-dark="isDark"
        :dark-theme="darkSyntaxTheme"
        :light-theme="lightSyntaxTheme"
        :max-height="visorMax"
      />
    </main>
  </div>
</template>
