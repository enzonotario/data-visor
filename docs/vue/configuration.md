# Configuration

Reference for the **`data-visor-vue`** `DataVisor` component. Extension-specific behavior is documented under [Web extension](/web-ext/).

The `DataVisor` component accepts several props for customization.

## Props Reference

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `string` | - | Serialized document text (JSON, YAML, or XML) to display. |
| `lang` | `'json' \| 'yaml' \| 'xml'` | `'json'` | Format of the `data` string. |
| `v-model:display-mode` | `'tree' \| 'minified'` | `'tree'` | Optional two-way binding. `tree` shows the expandable tree; `minified` shows the whole document as compact highlighted source. The toolbar includes **Tree \| Minified**; without `v-model`, the mode is kept inside the component (e.g. docs examples). In `minified`, expand/collapse, depth, and search stay visible but disabled. |
| `darkTheme` | `ShikiTheme` | `'github-dark'` | Shiki theme for dark mode. |
| `lightTheme` | `ShikiTheme` | `'github-light'` | Shiki theme for light mode. |
| `isDark` | `boolean` | `false` | Whether to use the dark theme. |
| `maxHeight` | `string` | `'600px'` | Maximum height of the viewer (e.g., `'500px'`, `'none'`, `'auto'`). |
| `minHeight` | `string` | - | Minimum height of the viewer. |
| `initialDepth` | `number` | `2` | Initial expansion depth. |
| `showLineNumbers`| `boolean`| `true` | Whether to show line numbers. |
| `showToolbar` | `boolean`| `true` | Whether to show the top toolbar. |
| `showBreadcrumb` | `boolean`| `true` | Whether to show the breadcrumb at the bottom. |

## CSS variables

The viewer sets custom properties on the inner root (`.dv-viewer`) for theme colors and intrinsic list height:

| Variable | Purpose |
| :--- | :--- |
| `--dv-bg` | Background color (from the active Shiki theme). |
| `--dv-fg` | Foreground / text color. |
| `--dv-list-min-height` | Used when `max-height` is intrinsic (`none` / `auto` / …) so the list matches content height. |

All public class names use the `dv-` prefix (e.g. `.dv-viewer-wrap`, `.dv-row`).

## Shortcuts

DataVisor supports several keyboard shortcuts for efficient navigation:

- `CTRL+F`: Open search.
- `CTRL+]` or `CTRL+SHIFT++`: Expand all (the `+` key on the main keyboard or numpad).
- `CTRL+[` or `CTRL+SHIFT+-`: Collapse all (the `-` key on the main keyboard or numpad).
- `CTRL+SHIFT+*` followed by `0-9`: Expand to specific level (Keyboard chord).
- `F3` / `SHIFT+F3`: Next / Previous search match.
- `ESC`: Close search or cancel keyboard chord.
