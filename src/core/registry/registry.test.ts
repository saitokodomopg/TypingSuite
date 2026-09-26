import { describe, expect, it } from 'vitest'
import type { TypingTask } from '../types/task.ts'
import { get, list, register } from './registry.ts'

function dummyTask(id: string): TypingTask {
  return {
    id,
    label: `ダミー課題 ${id}`,
    generate: () => ({
      displayText: 'あ',
      units: [{ display: 'あ', accepted: ['a'] }],
    }),
  }
}

describe('registry', () => {
  it('登録した課題を id で取得できる', () => {
    const task = dummyTask('registry-test-get')
    register(task)

    expect(get('registry-test-get')).toBe(task)
  })

  it('登録した課題が list に含まれる', () => {
    const task = dummyTask('registry-test-list')
    register(task)

    expect(list()).toContain(task)
  })

  it('未登録の id は undefined を返す', () => {
    expect(get('registry-test-unknown')).toBeUndefined()
  })

  it('同じ id を2回登録するとエラーになる', () => {
    const task = dummyTask('registry-test-duplicate')
    register(task)

    expect(() => register(dummyTask('registry-test-duplicate'))).toThrow()
  })
})

describe('registry（下位互換）', () => {
  it('endless を持たない課題（id・label・generate だけ）を登録・取得できる', () => {
    const task: TypingTask = {
      id: 'registry-test-no-endless',
      label: 'endless なし',
      generate: () => ({
        displayText: 'f',
        units: [{ display: 'f', accepted: ['f'] }],
      }),
    }
    register(task)

    const found = get('registry-test-no-endless')
    expect(found).toBe(task)
    expect(found?.endless).toBeUndefined()
    expect(found?.generate().displayText).toBe('f')
  })
})
