import { DataVisor } from 'data-visor-vue'
import { defineCustomElement } from 'vue'

const DEFAULT_TAG = 'data-visor'

function createDataVisorElementClass() {
  return defineCustomElement(DataVisor, {
    shadowRoot: false,
  })
}

/**
 * Class for the default tag `data-visor`. For other tag names, Vue requires a
 * **separate** class per registration — use {@link registerDataVisor}.
 *
 * Styles: import `data-visor-vue/style.css` once in your app (light DOM; no Shadow Root).
 */
export const DataVisorElement = createDataVisorElementClass()

export type RegisterDataVisorOptions = {
  /** Custom tag name (must contain a hyphen). Default: `data-visor`. */
  tagName?: string
}

/**
 * Registers `<data-visor>` (or `options.tagName`). Safe to call multiple times.
 * Each distinct tag name gets its own custom-element class (web platform requirement).
 *
 * @example
 * ```ts
 * import 'data-visor-vue/style.css'
 * import { registerDataVisor } from 'data-visor-element'
 * registerDataVisor()
 * ```
 */
export function registerDataVisor(options?: RegisterDataVisorOptions): void {
  const tagName = options?.tagName ?? DEFAULT_TAG
  if (customElements.get(tagName)) return
  const Ctor = tagName === DEFAULT_TAG ? DataVisorElement : createDataVisorElementClass()
  customElements.define(tagName, Ctor)
}
