# data-visor-element

Wraps [`data-visor-vue`](../data-visor-vue) as a **native Custom Element** (`<data-visor>`), using Vue’s [`defineCustomElement`](https://vuejs.org/guide/extras/web-components.html).

## Install

```bash
pnpm add data-visor-element data-visor-vue vue
```

Peer dependencies: `vue` ^3.5 and `data-visor-vue` (same major/minor as this package).

## Usage

Import the **component styles** once, then register the tag:

```ts
import 'data-visor-vue/style.css'
import { registerDataVisor } from 'data-visor-element'

registerDataVisor()
```

```html
<data-visor
  lang="json"
  data='{"hello":"world"}'
></data-visor>
```

Large payloads: prefer the `data` **property** in JS instead of a huge attribute:

```ts
const el = document.querySelector('data-visor')
el.data = JSON.stringify(bigObject)
```

### Custom tag name

Each distinct tag needs its own custom-element class (browser rule). Use:

```ts
registerDataVisor({ tagName: 'my-json-viewer' })
```

### Light DOM

The element uses **light DOM** (`shadowRoot: false`) so `data-visor-vue/style.css` applies normally. If you need Shadow DOM, open an issue — it would require bundling styles into the shadow root.

## API

- `registerDataVisor(options?)` — registers `<data-visor>` or `options.tagName`.
- `DataVisorElement` — the custom-element class for the default tag; you can also `customElements.define('data-visor', DataVisorElement)` yourself.

Props match [`DataVisor` props](https://github.com/enzonotario/data-visor/blob/main/docs/vue/configuration.md) (`data`, `lang`, `max-height`, etc.) using **kebab-case** in HTML.
