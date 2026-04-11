---
outline: [2, 3]
---

# Web extension (data-visor-web-ext)

**data-visor-web-ext** is a Chromium **Manifest V3** extension built with [WXT](https://wxt.dev). When you open a supported document in the tab, the extension replaces the page with the same **Data Visor** tree UI used by [`data-visor-vue`](/vue/getting-started), so you can browse JSON, YAML, and XML without leaving the browser.

## Install

**[Chrome Web Store — Data Visor](https://chromewebstore.google.com/detail/data-visor/eaaffhkhgmalbjinflnnkmgjcidmkmpc)** — install the extension in one click.

## What it does

- **URLs:** Activates on `*.json`, `*.yaml`, `*.yml`, and `*.xml` over `http(s):`, plus local `file://` documents (enable *Allow access to file URLs* for the extension in browser settings).
- **Raw view:** Append **`#raw`** to the URL to skip the extension and use the browser’s default view for that file.
- **Large files:** If the extracted text exceeds the tree limit (~700k characters), the extension does not take over so the browser can handle the file normally.
- **Shell theme:** Toolbar buttons **Auto** / **Dark** / **Light** control the outer chrome; the choice is stored in the extension’s **local storage** (not the page’s `localStorage`).
- **Syntax themes:** Separate dropdowns choose the **Shiki** theme for dark and light shell modes; those choices are also persisted for all sites.

Keyboard shortcuts inside the viewer match the [Vue component shortcuts](/vue/configuration#shortcuts) (search, expand/collapse, chords, etc.).

## Related

- [Privacy Policy](/web-ext/privacy-policy) — for Chrome Web Store disclosure and users.
- [Vue component docs](/vue/getting-started) — install `data-visor-vue` in your own app.
