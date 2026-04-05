import { type ComputedRef, computed, type Ref, ref } from 'vue'
import type { TreeNode, TreeValue, ViewerLang } from '../types/tree'
import { buildTree } from '../utils/tree'
import { parseXml } from '../utils/xmlTree'
import { parseYaml } from '../utils/yamlTree'

export interface UseTreeReturn {
  nodes: ComputedRef<TreeNode[]>
  nodeMap: ComputedRef<Map<string, TreeNode>>
  parseError: Ref<string | null>
}

export function useTree(source: Ref<string>, lang: Ref<ViewerLang>): UseTreeReturn {
  const parseError = ref<string | null>(null)

  const parsed = computed<TreeValue | null>(() => {
    const raw = source.value
    const language = lang.value
    try {
      parseError.value = null
      if (language === 'json') return JSON.parse(raw) as TreeValue
      if (language === 'yaml') return parseYaml(raw)
      if (language === 'xml') return parseXml(raw)
    } catch (e) {
      parseError.value = `${language.toUpperCase()} parse error: ${e instanceof Error ? e.message : String(e)}`
      return null
    }
    return null
  })

  const nodes = computed<TreeNode[]>(() => {
    if (parsed.value === null && parseError.value) return []
    return buildTree(parsed.value!)
  })

  const nodeMap = computed<Map<string, TreeNode>>(() => {
    const map = new Map<string, TreeNode>()
    for (const node of nodes.value) map.set(node.id, node)
    return map
  })

  return { nodes, nodeMap, parseError }
}
