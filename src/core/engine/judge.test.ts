import { describe, expect, it } from 'vitest'
import type { ChallengeUnit } from '../types/challenge.ts'
import { createJudgeState, isChallengeComplete, judgeKey } from './judge.ts'

const shiUnit: ChallengeUnit = { display: 'し', accepted: ['shi', 'si'] }
const taUnit: ChallengeUnit = { display: 'た', accepted: ['ta'] }

describe('judgeKey', () => {
  it('短い表記（si）でユニットを完了できる', () => {
    const state = createJudgeState()
    const first = judgeKey([shiUnit], state, 's')
    expect(first.outcome).toBe('progress')

    const second = judgeKey([shiUnit], first.state, 'i')
    expect(second.outcome).toBe('challengeComplete')
    expect(second.state.correctKeystrokes).toBe(2)
    expect(second.state.keystrokes).toBe(2)
  })

  it('長い表記（shi）でもユニットを完了できる', () => {
    let result = judgeKey([shiUnit], createJudgeState(), 's')
    result = judgeKey([shiUnit], result.state, 'h')
    expect(result.outcome).toBe('progress')
    result = judgeKey([shiUnit], result.state, 'i')
    expect(result.outcome).toBe('challengeComplete')
  })

  it('どの正解表記の前方一致にもならないキーはミスとして記録する', () => {
    const result = judgeKey([shiUnit], createJudgeState(), 'x')
    expect(result.outcome).toBe('miss')
    expect(result.state.buffer).toBe('')
    expect(result.state.keyMisses).toEqual({ x: 1 })
    expect(result.state.keystrokes).toBe(1)
    expect(result.state.correctKeystrokes).toBe(0)
  })

  it('ミスのあとに正しいキーを打てば継続できる', () => {
    let result = judgeKey([shiUnit], createJudgeState(), 'x')
    result = judgeKey([shiUnit], result.state, 's')
    expect(result.outcome).toBe('progress')
    expect(result.state.keyMisses).toEqual({ x: 1 })
  })

  it('複数ユニットは unitComplete を経て challengeComplete になる', () => {
    const units = [shiUnit, taUnit]
    let result = judgeKey(units, createJudgeState(), 's')
    result = judgeKey(units, result.state, 'i')
    expect(result.outcome).toBe('unitComplete')
    expect(isChallengeComplete(units, result.state)).toBe(false)

    result = judgeKey(units, result.state, 't')
    result = judgeKey(units, result.state, 'a')
    expect(result.outcome).toBe('challengeComplete')
    expect(isChallengeComplete(units, result.state)).toBe(true)
  })

  it('完了後にさらに打鍵するとエラーになる', () => {
    const units = [taUnit]
    let result = judgeKey(units, createJudgeState(), 't')
    result = judgeKey(units, result.state, 'a')
    expect(() => judgeKey(units, result.state, 'a')).toThrow()
  })
})
