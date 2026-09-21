import type { TypingTask } from '../types/task.ts'

const tasks = new Map<string, TypingTask>()

export function register(task: TypingTask): void {
  if (tasks.has(task.id)) {
    throw new Error(`既に登録済みの id です: ${task.id}`)
  }
  tasks.set(task.id, task)
}

export function get(id: string): TypingTask | undefined {
  return tasks.get(id)
}

export function list(): TypingTask[] {
  return Array.from(tasks.values())
}
