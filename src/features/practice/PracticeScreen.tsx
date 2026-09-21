import { useCallback, useEffect, useRef, useState } from 'react'
import type { JudgeOutcome, JudgeState } from '../../core/engine/judge.ts'
import { createJudgeState, judgeKey } from '../../core/engine/judge.ts'
import { calculateSession } from '../../core/engine/score.ts'
import { get, list } from '../../core/registry/registry.ts'
import type { Challenge } from '../../core/types/challenge.ts'
import type { Session } from '../../core/types/session.ts'
import '../../tasks/index.ts'

export function PracticeScreen() {
  const tasks = list()
  const [taskId, setTaskId] = useState<string>(() => tasks[0]?.id ?? '')
  const task = get(taskId)
  const [challenge, setChallenge] = useState<Challenge | undefined>(() => task?.generate())
  const [judgeState, setJudgeState] = useState<JudgeState>(createJudgeState)
  const [lastOutcome, setLastOutcome] = useState<JudgeOutcome | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    areaRef.current?.focus()
  }, [taskId])

  const handleTaskChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value
    setTaskId(nextId)
    setChallenge(get(nextId)?.generate())
    setJudgeState(createJudgeState())
    setLastOutcome(null)
    setSession(null)
    startedAtRef.current = null
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!challenge || session || event.key.length !== 1) {
        return
      }

      if (startedAtRef.current === null) {
        startedAtRef.current = performance.now()
      }

      const result = judgeKey(challenge.units, judgeState, event.key)
      setJudgeState(result.state)
      setLastOutcome(result.outcome)

      if (result.outcome === 'challengeComplete') {
        const durationMs = performance.now() - startedAtRef.current
        setSession(calculateSession(result.state, durationMs))
      }
    },
    [challenge, judgeState, session],
  )

  if (!task || !challenge) {
    return <p>課題が見つかりません</p>
  }

  const completed = challenge.units
    .slice(0, judgeState.unitIndex)
    .map((unit) => unit.display)
    .join('')
  const current = challenge.units[judgeState.unitIndex]?.display ?? ''

  return (
    <section>
      <label>
        課題を選ぶ：
        <select aria-label="課題を選ぶ" value={taskId} onChange={handleTaskChange}>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <h2>{task.label}</h2>
      <p>{challenge.displayText}</p>
      <div
        ref={areaRef}
        role="application"
        aria-label="練習エリア"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <p data-testid="progress">
          {completed}
          <strong>{current}</strong>
        </p>
        {lastOutcome === 'miss' && <p role="alert">ミス</p>}
      </div>
      {session && (
        <section aria-label="結果">
          <h3>結果</h3>
          <p>速度: {session.speed.toFixed(1)} 文字/分</p>
          <p>正確さ: {(session.accuracy * 100).toFixed(1)}%</p>
          <ul>
            {session.keyMisses.map((miss) => (
              <li key={miss.key}>
                {miss.key}: {miss.count}回
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
