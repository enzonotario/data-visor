---
outline: [1]
---

# Examples

Live examples for the **`data-visor-vue`** component. For installing the tree viewer as a browser extension, see [Web extension](/web-ext/).

Explore some practical examples using `DataVisor` with different formats and configurations.

## Content & Language

The `data` prop is mandatory and must be a string. Set `lang` to `'json'`, `'yaml'`, or `'xml'` so DataVisor parses and highlights the document correctly (`json` is the default).

The live demos below use the same sample dataset in three formats (see `$examples` in the docs theme). For static minified strings used in tests or demos, see `$examples.ALL_MINIFIED` (or `JSON_MINIFIED`, `YAML_MINIFIED`, `XML_MINIFIED`). For an interactive **minified source** view, use the **Tree \| Minified** control in the toolbar, or `v-model:display-mode` from a parent. Without `v-model`, the toolbar still toggles the view internally (see [playground](/playground.html)).

```vue
<script setup>
import { DataVisor } from 'data-visor-vue'

const jsonData = '{ "name": "Alice", "roles": ["admin"] }'
const yamlData = 'name: Alice\nroles:\n  - admin'
const xmlData = '<user><name>Alice</name><role>admin</role></user>'
</script>

<template>
  <DataVisor :data="jsonData" lang="json" />
  <DataVisor :data="yamlData" lang="yaml" />
  <DataVisor :data="xmlData" lang="xml" />
</template>
```

### JSON Demo {#examples-live-json}

<ClientOnly>
  <DataVisor
    :data="$examples.JSON"
    lang="json"
    :is-dark="$isDark.value"
  />
</ClientOnly>

### YAML Demo {#examples-live-yaml}

<ClientOnly>
  <DataVisor
    :data="$examples.YAML"
    lang="yaml"
    :is-dark="$isDark.value"
  />
</ClientOnly>

### XML Demo {#examples-live-xml}

<ClientOnly>
  <DataVisor
    :data="$examples.XML"
    lang="xml"
    :is-dark="$isDark.value"
  />
</ClientOnly>

## Themes & Dark Mode

DataVisor uses [Shiki](https://shiki.style/) for syntax highlighting. You can specify any bundled Shiki theme for both light and dark modes.

```vue
<script setup>
import { DataVisor } from 'data-visor-vue'

const data = JSON.stringify({ theme: 'custom' })
</script>

<template>
  <DataVisor 
    :data="data" 
    light-theme="vitesse-dark"
    dark-theme="vitesse-light"
  />
</template>
```

### Demo {#examples-live-themes}

<ClientOnly>
  <DataVisor 
    :data="$examples.JSON" 
    light-theme="vitesse-dark"
    dark-theme="vitesse-light"
    :is-dark="$isDark.value"
  />
</ClientOnly>

## Initial Depth

Controls how many levels of the tree are expanded by default when the component is mounted.

```vue
<template>
  <!-- Only top-level keys will be visible initially -->
  <DataVisor :data="data" :initial-depth="1" />
  
  <!-- Fully expanded up to 5 levels -->
  <DataVisor :data="data" :initial-depth="5" />
</template>
```

### Demo {#examples-live-depth}

<ClientOnly>
  <div class="flex flex-col gap-4">
    <p class="text-sm font-medium text-[var(--vp-c-text-1)]">Depth 1:</p>
    <DataVisor 
      :data="$examples.JSON" 
      :initial-depth="1"
      :is-dark="$isDark.value"
    />
    <p class="text-sm font-medium mt-2 text-[var(--vp-c-text-1)]">Depth 3:</p>
    <DataVisor 
      :data="$examples.JSON" 
      :initial-depth="3"
      :is-dark="$isDark.value"
    />
  </div>
</ClientOnly>

## Sizing (Height) {#sizing-max-height}

By default, the viewer has a maximum height of `600px` and will scroll internally if the content is longer. You can customize this using `max-height` and `min-height` with any CSS height value (e.g. `'300px'`, `'none'`, `'auto'`, `'100%'`).

```vue
<template>
  <!-- Fixed height with scrolling -->
  <DataVisor 
    :data="data" 
    max-height="200px" 
  />

  <!-- Auto height (expands with content) -->
  <DataVisor 
    :data="data" 
    max-height="none"
  />

  <!-- Min and max in px: height follows content between both (internal scroll at max) -->
  <DataVisor 
    :data="data" 
    min-height="300px"
    max-height="500px"
  />
</template>
```

### Demo {#examples-live-sizing}

<ClientOnly>
  <div class="flex flex-col gap-4">
    <p class="text-sm font-medium text-[var(--vp-c-text-1)]">Max Height 200px (scroll):</p>
    <DataVisor 
      :data="$examples.JSON" 
      :is-dark="$isDark.value"
      max-height="200px"
    />
    <p class="text-sm font-medium mt-2 text-[var(--vp-c-text-1)]">Max Height 'none' (full content):</p>
    <DataVisor 
      :data="$examples.JSON" 
      :is-dark="$isDark.value"
      max-height="none"
    />
    <p class="text-sm font-medium mt-2 text-[var(--vp-c-text-1)]">Min 300px / Max 500px:</p>
    <DataVisor 
      :data="$examples.JSON" 
      :is-dark="$isDark.value"
      min-height="300px"
      max-height="500px"
      :initial-depth="1"
    />
  </div>
</ClientOnly>

## UI Elements

You can toggle various parts of the UI like line numbers, the top toolbar (which includes search and expand/collapse actions), and the breadcrumb trail.

```vue
<template>
  <DataVisor 
    :data="data"
    :show-line-numbers="false"
    :show-toolbar="false"
    :show-breadcrumb="false"
  />
</template>
```

### Demo {#examples-live-ui-elements}

<ClientOnly>
  <DataVisor 
    :data="$examples.JSON"
    :show-line-numbers="false"
    :show-toolbar="false"
    :show-breadcrumb="false"
    :is-dark="$isDark.value"
  />
</ClientOnly>
