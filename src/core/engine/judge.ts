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

// 2つの判定状態の打鍵数・正打数・完了ユニット数・ミスを足し合わせる。
// 時間制の練習で、行をまたいだ合計を出すのに使う
export function mergeJudgeStates(a: JudgeState, b: JudgeState): JudgeState {
  const keyMisses = { ...a.keyMisses }
  for (const [key, count] of Object.entries(b.keyMisses)) {
    keyMisses[key] = (keyMisses[key] ?? 0) + count
  }
  return {
    unitIndex: a.unitIndex + b.unitIndex,
    buffer: '',
    keystrokes: a.keystrokes + b.keystrokes,
    correctKeystrokes: a.correctKeystrokes + b.correctKeystrokes,
    keyMisses,
  }
}
