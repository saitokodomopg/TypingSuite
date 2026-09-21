import type { ChallengeUnit } from '../../core/types/challenge.ts'
import type { TypingTask } from '../../core/types/task.ts'
import { register } from '../../core/registry/registry.ts'

const units: ChallengeUnit[] = ['f', 'j', 'f', 'j'].map((key) => ({
  display: key,
  accepted: [key],
}))

export const touchTypeFjTask: TypingTask = {
  id: 'touch-type-fj',
  label: 'タッチタイピング：ホームポジション(F/J)',
  generate: () => ({
    displayText: units.map((unit) => unit.display).join(''),
    units,
  }),
}

register(touchTypeFjTask)
