<script setup lang="ts">
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import HomeHeroDemo from './components/HomeHeroDemo.vue'

const { Layout } = DefaultTheme
const route = useRoute()

const showHomeDemo = computed(() => {
  const path = route.path
  return path === '/' || path === '/index.html'
})
</script>

<template>
  <Layout>
    <template v-if="showHomeDemo" #home-hero-image>
      <div class="dv-home-hero-demo">
        <HomeHeroDemo />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* Demo a la derecha del hero en desktop; en móvil: texto primero, demo debajo */
:deep(.VPHomeHero.VPHero.has-image .container) {
  align-items: stretch;
}

@media (max-width: 959px) {
  :deep(.VPHomeHero.VPHero.has-image .main) {
    order: 1;
  }

  :deep(.VPHomeHero.VPHero.has-image .image) {
    order: 2;
    margin-top: 1.5rem;
    margin-bottom: 0;
  }
}

/* Sustituir el círculo decorativo por espacio útil para el visor */
:deep(.VPHomeHero .image-bg) {
  display: none;
}

:deep(.VPHomeHero .image-container) {
  width: 100%;
  max-width: min(440px, 100%);
  height: auto;
  min-height: 260px;
  margin: 0 auto;
  transform: none;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

@media (min-width: 960px) {
  :deep(.VPHomeHero .image-container) {
    max-width: none;
    min-height: 320px;
    margin: 0;
    transform: translate(-16px, -16px);
  }
}

.dv-home-hero-demo {
  position: relative;
  z-index: 2;
  width: 100%;
  min-width: 0;
}

.dv-home-hero-demo__visor {
  max-width: 100%;
}

.dv-home-hero-demo__placeholder {
  min-height: 260px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--vp-c-text-1) 12%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent);
}
</style>
