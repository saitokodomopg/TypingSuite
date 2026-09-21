import type { Challenge } from './challenge.ts'

export type TypingTask = {
  id: string
  label: string
  generate(): Challenge
}
