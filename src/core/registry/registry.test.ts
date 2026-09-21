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
