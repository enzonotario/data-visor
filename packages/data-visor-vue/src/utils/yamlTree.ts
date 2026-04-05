import * as yaml from 'yaml'
import type { TreeValue } from '../types/tree'

export function parseYaml(content: string): TreeValue {
  const docs = yaml.parseAllDocuments(content)
  if (docs.length > 1) {
    throw new Error('Multi-document YAML is not supported')
  }
  return yaml.parse(content) as TreeValue
}
