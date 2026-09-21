import type { ChallengeUnit } from '../types/challenge.ts'

export type JudgeState = {
  unitIndex: number
  buffer: string
  keystrokes: number
  correctKeystrokes: number
  keyMisses: Record<string, number>
}

export type JudgeOutcome =
  'progress' | 'unitComplete' | 'challengeComplete' | 'miss'

export function createJudgeState(): JudgeState {
  return {
    unitIndex: 0,
    buffer: '',
    keystrokes: 0,
    correctKeystrokes: 0,
    keyMisses: {},
  }
}

export function isChallengeComplete(
  units: ChallengeUnit[],
  state: JudgeState,
): boolean {
  return state.unitIndex >= units.length
}

export function judgeKey(
  units: ChallengeUnit[],
  state: JudgeState,
  key: string,
): { state: JudgeState; outcome: JudgeOutcome } {
  if (isChallengeComplete(units, state)) {
    throw new Error('すでに課題は完了しています')
  }

  const unit = units[state.unitIndex]
  const candidate = state.buffer + key
  const keystrokes = state.keystrokes + 1

  if (!unit.accepted.some((pattern) => pattern.startsWith(candidate))) {
    return {
      state: {
        ...state,
        keystrokes,
        keyMisses: {
          ...state.keyMisses,
          [key]: (state.keyMisses[key] ?? 0) + 1,
        },
      },
      outcome: 'miss',
    }
  }

  const correctKeystrokes = state.correctKeystrokes + 1

  if (!unit.accepted.includes(candidate)) {
    return {
      state: { ...state, buffer: candidate, keystrokes, correctKeystrokes },
      outcome: 'progress',
    }
  }

  const unitIndex = state.unitIndex + 1
  const nextState: JudgeState = {
    ...state,
    buffer: '',
    keystrokes,
    correctKeystrokes,
    unitIndex,
  }
  return {
    state: nextState,
    outcome: unitIndex >= units.length ? 'challengeComplete' : 'unitComplete',
  }
}
