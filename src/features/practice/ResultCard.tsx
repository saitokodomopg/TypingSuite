import type { ReactNode } from 'react'
import type { Session } from '../../core/types/session.ts'
import { Card } from '../../shared/ui/Card.tsx'
import { BoltIcon, StarIcon, TargetIcon } from '../../shared/ui/icons.tsx'

type ResultCardProps = {
  session: Session
  // 課題ごとに足したい結果（行数・段階など）。result-tile として並べる
  children?: ReactNode
}

export function ResultCard({ session, children }: ResultCardProps) {
  return (
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
        {children}
      </div>
      {session.keyMisses.length > 0 ? (
        <ul className="result-misses">
          {session.keyMisses.map((miss) => (
            <li key={miss.key}>
              {miss.key === ' ' ? 'スペース' : miss.key}: {miss.count}回
            </li>
          ))}
        </ul>
      ) : (
        <p className="result-perfect">
          <StarIcon /> ミスなし！
        </p>
      )}
    </Card>
  )
}
