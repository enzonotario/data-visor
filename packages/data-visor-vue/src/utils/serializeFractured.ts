import { Formatter, FracturedJsonOptions } from 'fracturedjsonjs'
import type { TreeValue } from '../types/tree'

const formatter = new Formatter()
formatter.Options = new FracturedJsonOptions()

export function getFracturedFormatter(): Formatter {
  return formatter
}

/** Full document FracturedJson text, or null if input is not valid JSON. */
export function serializeFractured(raw: string): string | null {
  try {
    const t = raw.trim()
    if (!t) return null
    JSON.parse(t)
    return formatter.Reformat(raw)
  } catch {
    return null
  }
}

/** FracturedJson format for a subtree (used for copy-from-node in fractured mode). */
export function serializeFracturedValue(value: TreeValue): string {
  const s = formatter.Serialize(value)
  return s ?? JSON.stringify(value, null, 2)
}
