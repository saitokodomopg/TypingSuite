import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { JudgeOutcome, JudgeState } from '../../core/engine/judge.ts'
import { createJudgeState, judgeKey } from '../../core/engine/judge.ts'
import { calculateSession } from '../../core/engine/score.ts'
import { get } from '../../core/registry/registry.ts'
import type { Challenge } from '../../core/types/challenge.ts'
import type { Session } from '../../core/types/session.ts'
import { AppHeader } from '../../shared/ui/AppHeader.tsx'
import { Card } from '../../shared/ui/Card.tsx'
import { MascotIcon, RefreshIcon } from '../../shared/ui/icons.tsx'
import { KeyHintRow } from '../../shared/ui/KeyHintRow.tsx'
import { ProgressRing } from '../../shared/ui/ProgressRing.tsx'
import '../../tasks/index.ts'
import { displayOf } from './display.ts'
import { EndlessPractice } from './EndlessPractice.tsx'
import { ResultCard } from './ResultCard.tsx'
import { TaskPills } from './TaskPills.tsx'

export function PracticeScreen() {
  const { taskId = '' } = useParams<{ taskId: string }>()
  const task = get(taskId)
  // taskId をキーにして、課題が切り替わるたびに内部状態を作り直す
  if (task?.endless) {
    return <EndlessPractice key={taskId} task={task} endless={task.endless} />
  }
  return <PracticeScreenBody key={taskId} taskId={taskId} />
}

function PracticeScreenBody({ taskId }: { taskId: string }) {
  const task = get(taskId)
  const [challenge] = useState<Challenge | undefined>(() => task?.generate())
  const [judgeState, setJudgeState] = useState<JudgeState>(createJudgeState)
  const [lastOutcome, setLastOutcome] = useState<JudgeOutcome | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    areaRef.current?.focus()
  }, [])

  const handleRetry = useCallback(() => {
    setJudgeState(createJudgeState())
    setLastOutcome(null)
    setSession(null)
    startedAtRef.current = null
    areaRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // スペースでページがスクロールしないようにする
      if (event.key === ' ') {
        event.preventDefault()
      }

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
    return (
      <div className="screen practice-screen">
        <AppHeader backToMenu />
        <p>課題が見つかりません</p>
      </div>
    )
  }

  const completed = challenge.units
    .slice(0, judgeState.unitIndex)
    .map((unit) => unit.display)
    .join('')
  const currentUnit = challenge.units[judgeState.unitIndex]
  const current = displayOf(currentUnit?.display ?? '')
  const hintChar = currentUnit?.accepted[0]?.[0]

  return (
    <div className="screen practice-screen">
      <AppHeader backToMenu />

      <TaskPills taskId={taskId} />

      <Card className="challenge-card">
        <MascotIcon className="challenge-card-mascot" />
        <div>
          <h2>{task.label}</h2>
          <p className="challenge-card-text">{challenge.displayText}</p>
        </div>
      </Card>

      <Card className="typing-card">
        <div className="typing-card-head">
          <ProgressRing value={judgeState.unitIndex / challenge.units.length} />
          <button type="button" className="retry-button" onClick={handleRetry}>
            <RefreshIcon /> リトライ
          </button>
        </div>
        <div
          ref={areaRef}
          role="application"
          aria-label="練習エリア"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="typing-area"
        >
          <p data-testid="progress" className="typing-text">
            <span data-testid="typed-text" className="typed-text">
              {completed}
            </span>
            <strong data-testid="current-text" className="current-text">
              {current}
            </strong>
          </p>
          {lastOutcome === 'miss' && <p role="alert">ミス</p>}
        </div>
        <KeyHintRow char={hintChar} />
      </Card>

      {session && <ResultCard session={session} />}
    </div>
  )
}
