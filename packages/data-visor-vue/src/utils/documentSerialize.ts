import { XMLBuilder } from 'fast-xml-parser'
import { stringify as yamlStringify } from 'yaml'
import type { TreeValue, ViewerLang } from '../types/tree'
import { pathToSegments } from './path'

const xmlDocumentBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
})

/** Pretty-printed full document (same style as per-node copy in tree / fractured JSON branch). */
export function serializeDocumentForTreeView(lang: ViewerLang, value: TreeValue): string {
  if (lang === 'json') return JSON.stringify(value, null, 2)
  if (lang === 'yaml') return yamlStringify(value)
  return xmlDocumentBuilder.build(value)
}

export function serializeXmlNodeCopy(value: TreeValue, nodePath: string): string {
  if (nodePath === '$') return xmlDocumentBuilder.build(value)
  const segments = pathToSegments(nodePath)
  let tagName = 'node'
  for (let i = segments.length - 1; i >= 0; i--) {
    if (typeof segments[i] === 'string') {
      tagName = segments[i] as string
      break
    }
  }
  return xmlDocumentBuilder.build({ [tagName]: value })
}
