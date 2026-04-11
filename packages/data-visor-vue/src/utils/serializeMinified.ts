import type { ViewerLang } from '../types/tree'
import { parseXml } from './xmlTree'
import { parseYaml } from './yamlTree'

function minifyXmlWhitespace(raw: string): string {
  return raw
    .replace(/>\s*\r?\n\s*</g, '><')
    .replace(/\r?\n/g, '')
    .replace(/>\s+</g, '><')
    .trim()
}

export function serializeMinified(raw: string, lang: ViewerLang): string | null {
  try {
    if (lang === 'json') {
      return JSON.stringify(JSON.parse(raw))
    }
    if (lang === 'yaml') {
      return JSON.stringify(parseYaml(raw))
    }
    if (lang === 'xml') {
      void parseXml(raw)
      return minifyXmlWhitespace(raw)
    }
  } catch {
    return null
  }
  return null
}
