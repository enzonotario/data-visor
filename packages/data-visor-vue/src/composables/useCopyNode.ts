import { type ComputedRef, type Ref, ref } from 'vue'
import { stringify as yamlStringify } from 'yaml'
import type { TreeValue, ViewerLang } from '../types/tree'
import { serializeXmlNodeCopy } from '../utils/documentSerialize'

export interface UseCopyNodeReturn {
  copiedNodePath: Ref<string | null>
  copyNode: (value: TreeValue, nodePath: string) => void
}

export function useCopyNode(
  lang: Ref<ViewerLang>,
  copy: (text: string) => Promise<void>,
  jsonSerialize: ComputedRef<(value: TreeValue) => string>,
): UseCopyNodeReturn {
  const copiedNodePath = ref<string | null>(null)

  function copyNode(value: TreeValue, nodePath: string): void {
    let serialized: string
    if (lang.value === 'yaml') serialized = yamlStringify(value)
    else if (lang.value === 'xml') serialized = serializeXmlNodeCopy(value, nodePath)
    else serialized = jsonSerialize.value(value)
    copy(serialized)
    copiedNodePath.value = nodePath
    setTimeout(() => {
      copiedNodePath.value = null
    }, 1200)
  }

  return { copiedNodePath, copyNode }
}
