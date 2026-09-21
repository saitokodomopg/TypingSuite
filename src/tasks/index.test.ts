import { describe, expect, it } from 'vitest'
import { list } from '../core/registry/registry.ts'
import './index.ts'

describe('tasks/index', () => {
  it('複数の課題が衝突なくregistryに登録される', () => {
    const ids = list().map((task) => task.id)

    expect(ids).toContain('touch-type-fj')
    expect(ids).toContain('touch-type-dk')
  })
})
