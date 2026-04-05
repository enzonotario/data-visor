import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useChordShortcut } from '../../src/composables/useChordShortcut'

function makeTarget() {
  const listeners = new Map<string, EventListener[]>()
  const target = {
    addEventListener(type: string, fn: EventListener) {
      if (!listeners.has(type)) listeners.set(type, [])
      listeners.get(type)!.push(fn)
    },
    removeEventListener(type: string, fn: EventListener) {
      const list = listeners.get(type) ?? []
      const idx = list.indexOf(fn)
      if (idx !== -1) list.splice(idx, 1)
    },
    dispatch(event: KeyboardEvent) {
      for (const fn of listeners.get('keydown') ?? []) fn(event)
    },
  }
  return target
}

function key(k: string, opts: { ctrl?: boolean; shift?: boolean } = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key: k,
    ctrlKey: opts.ctrl ?? false,
    shiftKey: opts.shift ?? false,
    bubbles: true,
    cancelable: true,
  })
}

describe('useChordShortcut', () => {
  it('starts with isAwaitingSequence = false', () => {
    const target = ref(makeTarget() as unknown as EventTarget)
    const { isAwaitingSequence } = useChordShortcut(target)
    expect(isAwaitingSequence.value).toBe(false)
  })

  it('activates awaiting state on trigger combo', () => {
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const { isAwaitingSequence, register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, vi.fn())
    target.dispatch(key('*', { ctrl: true, shift: true }))
    expect(isAwaitingSequence.value).toBe(true)
  })

  it('calls handler with the pressed key after trigger', () => {
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const handler = vi.fn()
    const { register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, handler)
    target.dispatch(key('*', { ctrl: true, shift: true }))
    target.dispatch(key('3'))
    expect(handler).toHaveBeenCalledWith(['3'])
  })

  it('resets to idle after handler is called', () => {
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const { isAwaitingSequence, register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, vi.fn())
    target.dispatch(key('*', { ctrl: true, shift: true }))
    target.dispatch(key('5'))
    expect(isAwaitingSequence.value).toBe(false)
  })

  it('ESC cancels an active chord', () => {
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const handler = vi.fn()
    const { isAwaitingSequence, register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, handler)
    target.dispatch(key('*', { ctrl: true, shift: true }))
    target.dispatch(key('Escape'))
    expect(isAwaitingSequence.value).toBe(false)
    expect(handler).not.toHaveBeenCalled()
  })

  it('timeout cancels the chord', () => {
    vi.useFakeTimers()
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const handler = vi.fn()
    const { isAwaitingSequence, register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, handler, 500)
    target.dispatch(key('*', { ctrl: true, shift: true }))
    expect(isAwaitingSequence.value).toBe(true)
    vi.advanceTimersByTime(600)
    expect(isAwaitingSequence.value).toBe(false)
    expect(handler).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('unregisterAll prevents further chord activation', () => {
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const { isAwaitingSequence, register, unregisterAll } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, vi.fn())
    unregisterAll()
    target.dispatch(key('*', { ctrl: true, shift: true }))
    expect(isAwaitingSequence.value).toBe(false)
  })

  it('second trigger press resets timer and stays in awaiting state', () => {
    vi.useFakeTimers()
    const target = makeTarget()
    const tRef = ref(target as unknown as EventTarget)
    const handler = vi.fn()
    const { isAwaitingSequence, register } = useChordShortcut(tRef)
    register({ ctrl: true, shift: true, key: '*' }, handler, 1000)
    target.dispatch(key('*', { ctrl: true, shift: true }))
    vi.advanceTimersByTime(800)
    target.dispatch(key('*', { ctrl: true, shift: true }))
    vi.advanceTimersByTime(800)
    expect(isAwaitingSequence.value).toBe(true)
    vi.useRealTimers()
  })
})
