# Getting Started

This guide covers the **`data-visor-vue`** npm package (Vue 3 component). For the Chromium extension, see [Web extension](/web-ext/).

## Installation

```bash
pnpm add data-visor-vue
```

## Basic Usage

```vue
<script setup>
import { DataVisor } from 'data-visor-vue'

const data = `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "roles": ["admin", "user"],
      "meta": { "verified": true, "score": 9.5 }
    }
  ]
}`
</script>

<template>
  <DataVisor :data="data" lang="json" />
</template>
```

#### Demo

<ClientOnly>
  <DataVisor 
    :data="$examples.JSON" 
    lang="json" 
    :is-dark="$isDark.value"
  />
</ClientOnly>

## Supported Formats

DataVisor currently supports the following formats via the `lang` prop:
- `json`
- `yaml`
- `xml`

## Requirements

- **Vue 3.x**
- **Shiki** (included as a dependency)
