import type { KeyMiss, Session } from '../types/session.ts'
import type { JudgeState } from './judge.ts'

export function calculateSession(
  state: JudgeState,
  durationMs: number,
): Session {
  const accuracy =
    state.keystrokes === 0 ? 1 : state.correctKeystrokes / state.keystrokes

  const minutes = durationMs / 1000 / 60
  const speed = minutes === 0 ? 0 : state.unitIndex / minutes

  const keyMisses: KeyMiss[] = Object.entries(state.keyMisses).map(
    ([key, count]) => ({ key, count }),
  )

  return { speed, accuracy, durationMs, keyMisses }
}
