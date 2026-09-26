import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JudgeOutcome, JudgeState } from '../../core/engine/judge.ts'
import {
  createJudgeState,
  judgeKey,
  mergeJudgeStates,
} from '../../core/engine/judge.ts'
import { calculateSession } from '../../core/engine/score.ts'
import type { Challenge } from '../../core/types/challenge.ts'
import type { EndlessPlan, Stage, TypingTask } from '../../core/types/task.ts'
import { AppHeader } from '../../shared/ui/AppHeader.tsx'
import { Card } from '../../shared/ui/Card.tsx'
import { MascotIcon, RefreshIcon } from '../../shared/ui/icons.tsx'
import { KeyHintRow } from '../../shared/ui/KeyHintRow.tsx'
import { PillButton } from '../../shared/ui/PillButton.tsx'
import { ProgressRing } from '../../shared/ui/ProgressRing.tsx'
import { displayOf, stageNotice } from './display.ts'
import { ResultCard } from './ResultCard.tsx'
import { TaskPills } from './TaskPills.tsx'

// 選べる制限時間（分）
const DURATION_MINUTES = [1, 3, 5, 10]

type Phase = 'ready' | 'running' | 'finished'

type Line = { challenge: Challenge; stage: Stage }

type EndlessPracticeProps = {
  task: TypingTask
  endless: EndlessPlan
}

const formatRemaining = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function EndlessPractice({ task, endless }: EndlessPracticeProps) {
  const [minutes, setMinutes] = useState(DURATION_MINUTES[0])
  const [phase, setPhase] = useState<Phase>('ready')
  const [line, setLine] = useState<Line>(() =>
    endless.next({ clearedLines: 0 }),
  )
  const [clearedLines, setClearedLines] = useState(0)
  const [clearedState, setClearedState] = useState<JudgeState>(createJudgeState)
  const [judgeState, setJudgeState] = useState<JudgeState>(createJudgeState)
  const [lastOutcome, setLastOutcome] = useState<JudgeOutcome | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [remainingMs, setRemainingMs] = useState(minutes * 60_000)
  const startedAtRef = useRef<number | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const limitMs = minutes * 60_000

  useEffect(() => {
    areaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (phase !== 'running') {
      return
    }
    const id = setInterval(() => {
      const left = limitMs - (Date.now() - (startedAtRef.current ?? Date.now()))
      if (left <= 0) {
        setRemainingMs(0)
        setPhase('finished')
      } else {
        setRemainingMs(left)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase, limitMs])

  // 時間切れのときは「打ち終えた行の合計」＋「途中の行」を足して集計する
  const session = useMemo(
    () =>
      phase === 'finished'
        ? calculateSession(mergeJudgeStates(clearedState, judgeState), limitMs)
        : null,
    [phase, clearedState, judgeState, limitMs],
  )

  const reset = useCallback(
    (nextMinutes: number) => {
      setMinutes(nextMinutes)
      setPhase('ready')
      setLine(endless.next({ clearedLines: 0 }))
      setClearedLines(0)
      setClearedState(createJudgeState())
      setJudgeState(createJudgeState())
      setLastOutcome(null)
      setNotice(null)
      setRemainingMs(nextMinutes * 60_000)
      startedAtRef.current = null
      areaRef.current?.focus()
    },
    [endless],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // スペースでページがスクロールしないようにする
      if (event.key === ' ') {
        event.preventDefault()
      }

      if (phase === 'finished' || event.key.length !== 1) {
        return
      }

      if (phase === 'ready') {
        startedAtRef.current = Date.now()
        setPhase('running')
      }

      const result = judgeKey(line.challenge.units, judgeState, event.key)
      setLastOutcome(result.outcome)

      if (result.outcome !== 'challengeComplete') {
        setJudgeState(result.state)
        return
      }

      // 1行打ち終えたら、すぐ次の行を出す
      const cleared = clearedLines + 1
      const next = endless.next({ clearedLines: cleared })
      if (
        next.stage.level > line.stage.level &&
        next.stage.newKeys.length > 0
      ) {
        setNotice(stageNotice(next.stage.newKeys))
      }
      setClearedState(mergeJudgeStates(clearedState, result.state))
      setClearedLines(cleared)
      setLine(next)
      setJudgeState(createJudgeState())
    },
    [phase, line, judgeState, clearedLines, clearedState, endless],
  )

  const { challenge, stage } = line
  const completed = challenge.units
    .slice(0, judgeState.unitIndex)
    .map((unit) => unit.display)
    .join('')
  const currentUnit = challenge.units[judgeState.unitIndex]
  const current = displayOf(currentUnit?.display ?? '')
  const rest = challenge.units
    .slice(judgeState.unitIndex + 1)
    .map((unit) => unit.display)
    .join('')
  const hintChar =
    phase === 'finished' ? undefined : currentUnit?.accepted[0]?.[0]

  return (
    <div className="screen practice-screen">
      <AppHeader backToMenu />

      <TaskPills taskId={task.id} />

      <Card className="challenge-card">
        <MascotIcon className="challenge-card-mascot" />
        <div>
          <h2>{task.label}</h2>
          <p className="challenge-card-text">
            時間を選んで、キーを押すとスタート。時間いっぱいまで打ち続けよう
          </p>
        </div>
      </Card>

      <div role="group" aria-label="時間を選ぶ" className="duration-pills">
        {DURATION_MINUTES.map((m) => (
          <PillButton
            key={m}
            active={m === minutes}
            disabled={phase === 'running'}
            onClick={() => reset(m)}
          >
            {m}分
          </PillButton>
        ))}
      </div>

      <Card className="typing-card">
        <div className="typing-card-head">
          <div className="endless-status">
            <ProgressRing value={remainingMs / limitMs} />
            <div>
              <p className="endless-remaining" data-testid="remaining">
                残り {formatRemaining(remainingMs)}
              </p>
              <p className="endless-stage" data-testid="stage">
                段階 {stage.level} / {stage.totalLevels}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="retry-button"
            onClick={() => reset(minutes)}
          >
            <RefreshIcon /> リトライ
          </button>
        </div>
        {notice && (
          <p role="status" className="stage-notice">
            {notice}
          </p>
        )}
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
            <span data-testid="rest-text" className="rest-text">
              {rest}
            </span>
          </p>
          {lastOutcome === 'miss' && <p role="alert">ミス</p>}
          {phase === 'finished' && (
            <p className="endless-finished">時間です！</p>
          )}
        </div>
        <KeyHintRow char={hintChar} availableKeys={stage.keys} />
      </Card>

      {session && (
        <ResultCard session={session}>
          <div className="result-tile">
            <span>打ち終えた行数: {clearedLines}行</span>
          </div>
          <div className="result-tile">
            <span>
              たどり着いた段階: 段階 {stage.level} / {stage.totalLevels}
            </span>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
