import { XMLParser } from 'fast-xml-parser'
import type { TreeValue } from '../types/tree'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
})

export function parseXml(content: string): TreeValue {
  return parser.parse(content) as TreeValue
}
