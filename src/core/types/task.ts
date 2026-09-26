import type { Challenge } from './challenge.ts'

// 段階の情報。画面の「段階が上がった」表示・キーの薄表示・結果表示に使う
export type Stage = {
  level: number // 1 始まり
  totalLevels: number
  keys: string[] // この段階までに出てくるキー（スペースは含めない）
  newKeys: string[] // この段階で増えたキー（増えない段階は空）
}

// 時間制で出題し続ける課題の出題方法
export type EndlessPlan = {
  // これまでに打ち終えた行数から、次の1行と今の段階を返す
  next(progress: { clearedLines: number }): {
    challenge: Challenge
    stage: Stage
  }
}

export type TypingTask = {
  id: string
  label: string
  generate(): Challenge
  endless?: EndlessPlan // 省略した課題は今までどおり1問で終わる
}
