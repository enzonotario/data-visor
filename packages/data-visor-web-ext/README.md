# data-visor-web-ext

User-facing documentation lives in the monorepo site: **Web extension** → [Overview](../../docs/web-ext/index.md) (run `pnpm docs:dev` from the repo root to preview).

[WXT](https://wxt.dev) browser extension: replaces the tab with **DataVisor** (from `data-visor-vue`) for `.json`, `.yaml`, `.yml`, and `.xml` URLs.

Append **`#raw`** to the URL to skip the extension and use the browser’s default view for that file. Files larger than the tree limit are also left to the browser.

## Setup

From monorepo root:

```bash
pnpm install
pnpm --filter data-visor-vue build
pnpm --filter data-visor-web-ext dev
```

Load the unpacked extension from `packages/data-visor-web-ext/.output/chrome-mv3` (path may differ by browser; see WXT output).

For **local `file://`** URLs, enable “Allow access to file URLs” for the extension in the browser’s extension settings.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | WXT dev + watch |
| `pnpm build` | Production build (runs `data-visor-vue` build first) |
| `pnpm test` | Vitest unit tests |
