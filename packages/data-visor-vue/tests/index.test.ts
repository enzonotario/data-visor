import { describe, expect, it } from 'vitest'
import { DataVisor } from '../src'

describe('package exports', () => {
  it('exports DataVisor component', () => {
    expect(DataVisor).toBeDefined()
    expect(typeof DataVisor).toBe('object')
  })
})
