import { useEventListener } from '@vueuse/core'
import { type Ref, ref } from 'vue'

export interface KeyCombo {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  key: string
}

type ChordHandler = (keys: string[]) => void

interface RegisteredChord {
  trigger: KeyCombo
  handler: ChordHandler
  timeoutMs: number
}

export interface UseChordShortcutReturn {
  isAwaitingSequence: Ref<boolean>
  pendingKeys: Ref<string[]>
  register: (trigger: KeyCombo, handler: ChordHandler, timeoutMs?: number) => void
  unregisterAll: () => void
}

function matchesCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
  return (
    event.key.toLowerCase() === combo.key.toLowerCase() &&
    !!event.ctrlKey === !!combo.ctrl &&
    !!event.shiftKey === !!combo.shift &&
    !!event.altKey === !!combo.alt
  )
}

export function useChordShortcut(
  target: Ref<EventTarget | null | undefined> | EventTarget = typeof document !== 'undefined'
    ? document
    : ({} as EventTarget),
): UseChordShortcutReturn {
  const chords: RegisteredChord[] = []
  const isAwaitingSequence = ref(false)
  const pendingKeys = ref<string[]>([])

  let activeChord: RegisteredChord | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function cancelChord(): void {
    isAwaitingSequence.value = false
    pendingKeys.value = []
    activeChord = null
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function activateChord(chord: RegisteredChord, event: KeyboardEvent): void {
    event.preventDefault()
    if (timeoutId !== null) clearTimeout(timeoutId)
    isAwaitingSequence.value = true
    pendingKeys.value = []
    activeChord = chord
    timeoutId = setTimeout(cancelChord, chord.timeoutMs)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (isAwaitingSequence.value) {
        event.preventDefault()
        cancelChord()
        return
      }
    }

    for (const chord of chords) {
      if (matchesCombo(event, chord.trigger)) {
        activateChord(chord, event)
        return
      }
    }

    if (isAwaitingSequence.value && activeChord) {
      event.preventDefault()
      const handler = activeChord.handler
      pendingKeys.value = [...pendingKeys.value, event.key]
      const captured = [...pendingKeys.value]
      cancelChord()
      handler(captured)
    }
  }

  useEventListener(target, 'keydown', onKeydown as EventListener)

  function register(trigger: KeyCombo, handler: ChordHandler, timeoutMs = 1500): void {
    chords.push({ trigger, handler, timeoutMs })
  }

  function unregisterAll(): void {
    chords.length = 0
    cancelChord()
  }

  return { isAwaitingSequence, pendingKeys, register, unregisterAll }
}
