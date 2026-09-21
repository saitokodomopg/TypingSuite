import { describe, expect, it } from 'vitest'
import { calculateSession } from './score.ts'
import type { JudgeState } from './judge.ts'

describe('calculateSession', () => {
  it('正確さ・速度・キーミスを計算する', () => {
    const state: JudgeState = {
      unitIndex: 2,
      buffer: '',
      keystrokes: 3,
      correctKeystrokes: 2,
      keyMisses: { x: 1 },
    }

    const session = calculateSession(state, 60_000)

    expect(session.accuracy).toBeCloseTo(2 / 3)
    expect(session.speed).toBe(2)
    expect(session.durationMs).toBe(60_000)
    expect(session.keyMisses).toEqual([{ key: 'x', count: 1 }])
  })

  it('打鍵が1つもなければ正確さは1として扱う', () => {
    const state: JudgeState = {
      unitIndex: 0,
      buffer: '',
      keystrokes: 0,
      correctKeystrokes: 0,
      keyMisses: {},
    }

    const session = calculateSession(state, 0)

    expect(session.accuracy).toBe(1)
    expect(session.speed).toBe(0)
  })
})
