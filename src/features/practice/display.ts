import { fingerLabel } from '../../core/keyboard/layout.ts'

// 次の文字がスペースのとき、画面で見えるように置き換える
export const displayOf = (text: string): string => (text === ' ' ? '␣' : text)

// 例：「R・V が増えたよ（左手・人さし指）／U・M が増えたよ（右手・人さし指）」
export function stageNotice(newKeys: string[]): string {
  const groups = new Map<string, string[]>()
  for (const key of newKeys) {
    const label = fingerLabel(key) ?? ''
    groups.set(label, [...(groups.get(label) ?? []), key.toUpperCase()])
  }
  return Array.from(
    groups,
    ([label, keys]) => `${keys.join('・')} が増えたよ（${label}）`,
  ).join('／')
}
