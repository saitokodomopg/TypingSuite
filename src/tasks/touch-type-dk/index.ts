import type { ChallengeUnit } from '../../core/types/challenge.ts'
import type { TypingTask } from '../../core/types/task.ts'
import { register } from '../../core/registry/registry.ts'

// 複数課題が同時にregistryへ登録されても衝突しないことを確認するための課題。
// 本格的なコンテンツは生徒が担当分を追加する際に置き換わっていく想定。
const units: ChallengeUnit[] = ['d', 'k', 'd', 'k'].map((key) => ({
  display: key,
  accepted: [key],
}))

export const touchTypeDkTask: TypingTask = {
  id: 'touch-type-dk',
  label: 'タッチタイピング：ホームポジション(D/K)（確認用）',
  generate: () => ({
    displayText: units.map((unit) => unit.display).join(''),
    units,
  }),
}

register(touchTypeDkTask)
