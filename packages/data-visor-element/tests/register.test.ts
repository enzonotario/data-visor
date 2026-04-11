import { afterEach, describe, expect, it } from 'vitest'
import { DataVisorElement, registerDataVisor } from '../src/index'

describe('data-visor-element', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registerDataVisor defines the default tag once', () => {
    registerDataVisor()
    expect(customElements.get('data-visor')).toBe(DataVisorElement)
    registerDataVisor()
    expect(customElements.get('data-visor')).toBe(DataVisorElement)
  })

  it('registerDataVisor accepts a custom tag name', () => {
    registerDataVisor({ tagName: 'my-json-viewer' })
    const ctor = customElements.get('my-json-viewer')
    expect(ctor).toBeDefined()
    expect(ctor).not.toBe(DataVisorElement)
  })

  it('mounts with sample props', async () => {
    registerDataVisor({ tagName: 'data-visor-mount-test' })
    const el = document.createElement('data-visor-mount-test') as HTMLElement & { data?: string }
    el.setAttribute('data', JSON.stringify({ a: 1 }))
    el.setAttribute('lang', 'json')
    document.body.appendChild(el)
    await new Promise((r) => requestAnimationFrame(r))
    await new Promise((r) => requestAnimationFrame(r))
    expect(el.shadowRoot).toBeNull()
    expect(el.querySelector('.dv-viewer')).toBeTruthy()
  })
})
