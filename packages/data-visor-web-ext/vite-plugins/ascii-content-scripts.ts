import { transformSync } from 'esbuild'
import type { Plugin } from 'vite'

export function asciiContentScripts(): Plugin {
  return {
    name: 'ascii-content-scripts',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type !== 'chunk') continue
        if (!fileName.endsWith('.js')) continue
        if (!fileName.includes('content-scripts')) continue
        const r = transformSync(output.code, {
          charset: 'ascii',
          minify: false,
          loader: 'js',
        })
        output.code = r.code
      }
    },
  }
}
