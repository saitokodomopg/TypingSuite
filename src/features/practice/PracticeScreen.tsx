import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { JudgeOutcome, JudgeState } from '../../core/engine/judge.ts'
import { createJudgeState, judgeKey } from '../../core/engine/judge.ts'
import { calculateSession } from '../../core/engine/score.ts'
import { get, list } from '../../core/registry/registry.ts'
import type { Challenge } from '../../core/types/challenge.ts'
import type { Session } from '../../core/types/session.ts'
import { AppHeader } from '../../shared/ui/AppHeader.tsx'
import { Card } from '../../shared/ui/Card.tsx'
import { BoltIcon, MascotIcon, RefreshIcon, StarIcon, TargetIcon } from '../../shared/ui/icons.tsx'
import { KeyHintRow } from '../../shared/ui/KeyHintRow.tsx'
import { PillButton } from '../../shared/ui/PillButton.tsx'
import { ProgressRing } from '../../shared/ui/ProgressRing.tsx'
import '../../tasks/index.ts'

export function PracticeScreen() {
  const { taskId = '' } = useParams<{ taskId: string }>()
  // taskId をキーにして、課題が切り替わるたびに内部状態を作り直す
  return <PracticeScreenBody key={taskId} taskId={taskId} />
}

function PracticeScreenBody({ taskId }: { taskId: string }) {
  const navigate = useNavigate()
  const tasks = list()
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

  const handleTaskSelect = useCallback(
    (nextId: string) => {
      navigate(`/practice/${nextId}`)
    },
    [navigate],
  )

  const handleRetry = useCallback(() => {
    setJudgeState(createJudgeState())
    setLastOutcome(null)
    setSession(null)
    startedAtRef.current = null
    areaRef.current?.focus()
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
  const current = currentUnit?.display ?? ''
  const hintChar = currentUnit?.accepted[0]?.[0]

  return (
    <div className="screen practice-screen">
      <AppHeader backToMenu />

      <div role="group" aria-label="課題を選ぶ" className="task-pills">
        {tasks.map((t) => (
          <PillButton key={t.id} active={t.id === taskId} onClick={() => handleTaskSelect(t.id)}>
            {t.label}
          </PillButton>
        ))}
      </div>

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

      {session && (
        <Card className="result-card" aria-label="結果">
          <h3>結果</h3>
          <div className="result-tiles">
            <div className="result-tile">
              <BoltIcon />
              <span>速度: {session.speed.toFixed(1)} 文字/分</span>
            </div>
            <div className="result-tile">
              <TargetIcon />
              <span>正確さ: {(session.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
          {session.keyMisses.length > 0 ? (
            <ul className="result-misses">
              {session.keyMisses.map((miss) => (
                <li key={miss.key}>
                  {miss.key}: {miss.count}回
                </li>
              ))}
            </ul>
          ) : (
            <p className="result-perfect">
              <StarIcon /> ミスなし！
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
