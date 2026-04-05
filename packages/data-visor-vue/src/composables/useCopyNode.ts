import { XMLBuilder } from 'fast-xml-parser'
import { type Ref, ref } from 'vue'
import { stringify as yamlStringify } from 'yaml'
import type { TreeValue, ViewerLang } from '../types/tree'
import { pathToSegments } from '../utils/path'

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
})

export interface UseCopyNodeReturn {
  copiedNodePath: Ref<string | null>
  copyNode: (value: TreeValue, nodePath: string) => void
}

export function useCopyNode(
  lang: Ref<ViewerLang>,
  copy: (text: string) => Promise<void>,
): UseCopyNodeReturn {
  const copiedNodePath = ref<string | null>(null)

  function serializeXml(value: TreeValue, nodePath: string): string {
    if (nodePath === '$') return xmlBuilder.build(value)
    const segments = pathToSegments(nodePath)
    let tagName = 'node'
    for (let i = segments.length - 1; i >= 0; i--) {
      if (typeof segments[i] === 'string') {
        tagName = segments[i] as string
        break
      }
    }
    return xmlBuilder.build({ [tagName]: value })
  }

  function copyNode(value: TreeValue, nodePath: string): void {
    let serialized: string
    if (lang.value === 'yaml') serialized = yamlStringify(value)
    else if (lang.value === 'xml') serialized = serializeXml(value, nodePath)
    else serialized = JSON.stringify(value, null, 2)
    copy(serialized)
    copiedNodePath.value = nodePath
    setTimeout(() => {
      copiedNodePath.value = null
    }, 1200)
  }

  return { copiedNodePath, copyNode }
}
