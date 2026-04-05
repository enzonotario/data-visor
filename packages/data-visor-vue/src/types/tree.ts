export type Primitive = string | number | boolean | null
export type TreeObject = { [key: string]: TreeValue }
export type TreeArray = TreeValue[]
export type TreeValue = Primitive | TreeObject | TreeArray

export type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'

export interface TreeNode {
  id: string
  type: NodeType
  key: string | number | undefined
  value: TreeValue
  depth: number
  path: string
  childCount: number
  isCollapsible: boolean
  sourceLine: number
  isClosing?: boolean
  parentId?: string
}

export type ViewerLang = 'json' | 'yaml' | 'xml'

export interface DataVisorProps {
  data: string
  lang?: ViewerLang
  darkTheme?: ShikiTheme
  lightTheme?: ShikiTheme
  isDark?: boolean
  maxHeight?: string
  minHeight?: string
  initialDepth?: number
  showLineNumbers?: boolean
  showToolbar?: boolean
  showBreadcrumb?: boolean
}

export type DataVisorEmit = {
  'node-click': [node: TreeNode]
  copy: [value: string]
  'search-change': [query: string]
  'expansion-change': [expandedCount: number]
}

import type { BundledTheme, ThemeRegistration, ThemeRegistrationRaw } from 'shiki'

export type ShikiTheme = BundledTheme | ThemeRegistration | ThemeRegistrationRaw
