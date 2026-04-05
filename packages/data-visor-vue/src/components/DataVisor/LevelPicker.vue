<script lang="ts">
import { ref } from 'vue'

const sharedLevel = ref(1)
</script>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  modelValue?: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  select: [value: number]
}>()

const MIN = props.min ?? 1
const MAX = props.max ?? 9

const current = ref(props.modelValue ?? sharedLevel.value)
const slideDir = ref<'left' | 'right'>('right')

watch(() => props.modelValue, (v) => { if (v !== undefined) current.value = v })

watch(sharedLevel, (v) => { if (v !== current.value) set(v) })

function set(n: number) {
  const next = Math.min(MAX, Math.max(MIN, n))
  if (next === current.value) return
  slideDir.value = next > current.value ? 'right' : 'left'
  current.value = next
  sharedLevel.value = next
  emit('update:modelValue', next)
}

function step(delta: number) { set(current.value + delta) }

function onWheel(e: WheelEvent) {
  e.preventDefault()
  step(e.deltaY > 0 ? -1 : 1)
}

let lastTouchX = 0
function onTouchStart(e: TouchEvent) { lastTouchX = e.touches[0].clientX }
function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  const dx = lastTouchX - e.touches[0].clientX
  if (Math.abs(dx) > 10) {
    step(dx > 0 ? -1 : 1)
    lastTouchX = e.touches[0].clientX
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); step(1) }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); step(-1) }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emit('select', current.value) }
  const n = Number(e.key)
  if (!isNaN(n) && n >= MIN && n <= MAX) set(n)
}
</script>

<template>
  <div
    class="lp"
    tabindex="0"
    :title="`Level ${current} — click to expand, scroll/drag to change`"
    @wheel="onWheel"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @keydown="onKeyDown"
    @click.stop
  >
    <button class="lp__arrow lp__arrow--left" tabindex="-1" @click.stop="step(-1)">
      <span class="dv-ico dv-ico--chevron-left" aria-hidden="true" />
    </button>

    <div class="lp__track" @click.stop="emit('select', current)">
      <Transition :name="`lp-${slideDir}`">
        <span :key="current" class="lp__num">{{ current }}</span>
      </Transition>
    </div>

    <button class="lp__arrow lp__arrow--right" tabindex="-1" @click.stop="step(1)">
      <span class="dv-ico dv-ico--chevron-right" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.lp {
  position: relative;
  width: 32px;
  height: 20px;
  border-radius: 3px;
  flex-shrink: 0;
  outline: none;
  overflow: hidden;
  cursor: default;
}

.lp:focus-within {
  outline: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  outline-offset: -1px;
}

.lp__arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity 0.1s;
  font-size: 10px;
}

.lp__arrow--left { left: 0; }
.lp__arrow--right { right: 0; }

.lp:hover .lp__arrow,
.lp:focus-within .lp__arrow {
  opacity: 0.55;
}
.lp__arrow:hover { opacity: 1 !important; }

.lp__track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.1s;
}

.lp__track:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lp__num {
  position: absolute;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  user-select: none;
}

.lp-right-enter-from  { transform: translateX(60%); opacity: 0; }
.lp-right-enter-active { transition: transform 0.13s ease, opacity 0.13s ease; }
.lp-right-leave-to    { transform: translateX(-60%); opacity: 0; }
.lp-right-leave-active { transition: transform 0.13s ease, opacity 0.13s ease; position: absolute; }

.lp-left-enter-from  { transform: translateX(-60%); opacity: 0; }
.lp-left-enter-active { transition: transform 0.13s ease, opacity 0.13s ease; }
.lp-left-leave-to    { transform: translateX(60%); opacity: 0; }
.lp-left-leave-active { transition: transform 0.13s ease, opacity 0.13s ease; position: absolute; }
</style>
