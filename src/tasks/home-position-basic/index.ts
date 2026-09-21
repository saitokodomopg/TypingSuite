import type { ChallengeUnit } from '../../core/types/challenge.ts'
import type { TypingTask } from '../../core/types/task.ts'
import { register } from '../../core/registry/registry.ts'

const patterns = ['asdf', 'jkl;', 'asdfjkl;']

const toUnits = (keys: string): ChallengeUnit[] =>
  keys.split('').map((key) => ({ display: key, accepted: [key] }))

export const homePositionBasicTask: TypingTask = {
  id: 'home-position-basic',
  label: 'ホームポジション基礎（A S D F / J K L ;）',
  generate: () => {
    const keys = patterns[Math.floor(Math.random() * patterns.length)]
    const units = toUnits(keys)
    return {
      displayText: units.map((unit) => unit.display).join(''),
      units,
    }
  },
}

register(homePositionBasicTask)
