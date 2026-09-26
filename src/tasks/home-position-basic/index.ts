import { fingerOf } from '../../core/keyboard/layout.ts'
import type { Challenge, ChallengeUnit } from '../../core/types/challenge.ts'
import type { Stage, TypingTask } from '../../core/types/task.ts'
import { register } from '../../core/registry/registry.ts'

// この行数を打ち終えるごとに1段階上がる
export const LINES_PER_STAGE = 4
// 1行に並べるかたまりの数
const CHUNKS_PER_LINE = 5

// 段階ごとに増えるキー。最後の段階は増えず、英単語を打つ
export const STAGE_KEYS: string[][] = [
  ['f', 'j'],
  ['d', 'k'],
  ['s', 'l'],
  ['a', ';'],
  ['g', 'h'],
  ['r', 'u', 'v', 'm'],
  ['e', 'i', 'c', ','],
  ['w', 'o', 'x', '.'],
  ['q', 'p', 'z', '/'],
  ['t', 'y', 'b', 'n'],
  [],
]

const HOME_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']

// 同じ指で縦に並ぶキー（上・中・下）
const COLUMNS = [
  ['q', 'a', 'z'],
  ['w', 's', 'x'],
  ['e', 'd', 'c'],
  ['r', 'f', 'v'],
  ['t', 'g', 'b'],
  ['y', 'h', 'n'],
  ['u', 'j', 'm'],
  ['i', 'k', ','],
  ['o', 'l', '.'],
  ['p', ';', '/'],
]

// 最後の段階で出す英単語。同じ文字が3回続く語は入れない
const WORDS = [
  'hello',
  'water',
  'black',
  'apple',
  'music',
  'happy',
  'house',
  'green',
  'smile',
  'dream',
  'light',
  'river',
  'cloud',
  'world',
  'bread',
  'train',
  'money',
  'paper',
  'sound',
  'dance',
  'magic',
  'story',
  'night',
  'color',
  'friend',
  'school',
  'summer',
  'winter',
  'orange',
  'yellow',
  'planet',
  'garden',
  'rabbit',
  'pencil',
  'window',
  'animal',
  'number',
  'basket',
  'quick',
  'zebra',
  'voice',
  'jump',
  'key',
  'box',
  'sky',
  'fox',
]

const randomInt = (max: number): number => Math.floor(Math.random() * max)

const pick = <T>(items: T[]): T => items[randomInt(items.length)]

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function hasTripleRepeat(text: string): boolean {
  for (let i = 2; i < text.length; i++) {
    if (text[i] === text[i - 1] && text[i] === text[i - 2]) {
      return true
    }
  }
  return false
}

const sameFinger = (a: string, b: string): boolean => {
  const fa = fingerOf(a)
  const fb = fingerOf(b)
  return !!fa && !!fb && fa.hand === fb.hand && fa.finger === fb.finger
}

export function levelOf(clearedLines: number): number {
  return Math.min(
    STAGE_KEYS.length,
    Math.floor(clearedLines / LINES_PER_STAGE) + 1,
  )
}

export function stageOf(level: number): Stage {
  return {
    level,
    totalLevels: STAGE_KEYS.length,
    keys: STAGE_KEYS.slice(0, level).flat(),
    newKeys: STAGE_KEYS[level - 1],
  }
}

// ホーム → 同じ指のキー → ホーム（例：frf, dedcd）
function homeReturnChunk(
  home: string,
  others: string[],
  must?: string,
): string {
  const first = must ?? pick(others)
  if (Math.random() < 0.5) {
    return home + first + home
  }
  return home + first + home + pick(others) + home
}

// 同じ指の上・中・下を順か逆に（例：edc, cde, qazaq）
function columnChunk(column: string[]): string {
  const ordered = Math.random() < 0.5 ? column : [...column].reverse()
  if (Math.random() < 0.5) {
    return ordered.join('')
  }
  return [...ordered, ...ordered.slice(0, 2).reverse()].join('')
}

// 同じ指で打つキーのかたまり。must を渡すとそのキーを必ず含める
function sameFingerChunk(
  keys: string[],
  anchor: string,
  must?: string,
): string | undefined {
  const home = HOME_KEYS.find((key) => sameFinger(key, anchor))
  if (!home) {
    return undefined
  }
  const others = keys.filter((key) => key !== home && sameFinger(key, home))
  if (others.length === 0) {
    return undefined
  }
  const columns = COLUMNS.filter(
    (column) =>
      sameFinger(column[0], home) &&
      column.every((key) => keys.includes(key)) &&
      (!must || column.includes(must)),
  )
  // ホームに戻る並びを多めにする
  if (columns.length > 0 && Math.random() < 1 / 3) {
    return columnChunk(pick(columns))
  }
  return homeReturnChunk(home, others, must)
}

// 今の段階までのキーから3〜5文字をまぜる
function mixChunk(keys: string[]): string {
  for (;;) {
    const length = 3 + randomInt(3)
    const chunk = Array.from({ length }, () => pick(keys)).join('')
    if (!hasTripleRepeat(chunk)) {
      return chunk
    }
  }
}

// 新しいキーを含むかたまり。同じ指のキーがまだなければ、新しいキーと他のキーを交互に並べる
function newKeyChunk(keys: string[], newKeys: string[]): string {
  const key = pick(newKeys)
  const chunk = sameFingerChunk(
    keys,
    key,
    HOME_KEYS.includes(key) ? undefined : key,
  )
  if (chunk) {
    return chunk
  }
  const others = keys.filter((other) => other !== key)
  const length = 3 + randomInt(3)
  return Array.from({ length }, (_, i) =>
    i % 2 === 0 ? key : pick(others),
  ).join('')
}

// 今の段階までのキーで、同じ指のかたまりかまぜるかたまりを作る
function reviewChunk(keys: string[]): string {
  if (Math.random() < 0.5) {
    const chunk = sameFingerChunk(keys, pick(keys))
    if (chunk) {
      return chunk
    }
  }
  return mixChunk(keys)
}

function buildLine(stage: Stage, lineInStage: number): string[] {
  if (stage.newKeys.length === 0) {
    return Array.from({ length: CHUNKS_PER_LINE }, () => pick(WORDS))
  }
  // 段階が上がった直後の2行は新しいキーを多めに、残りの行は前の指もまぜる
  const newCount = lineInStage < 2 ? CHUNKS_PER_LINE - 1 : 2
  const chunks = [
    ...Array.from({ length: newCount }, () =>
      newKeyChunk(stage.keys, stage.newKeys),
    ),
    ...Array.from({ length: CHUNKS_PER_LINE - newCount }, () =>
      reviewChunk(stage.keys),
    ),
  ]
  return shuffle(chunks)
}

const toChallenge = (text: string): Challenge => {
  const units: ChallengeUnit[] = text
    .split('')
    .map((key) => ({ display: key, accepted: [key] }))
  return { displayText: text, units }
}

export function nextLine(clearedLines: number): {
  challenge: Challenge
  stage: Stage
} {
  const stage = stageOf(levelOf(clearedLines))
  const text = buildLine(stage, clearedLines % LINES_PER_STAGE).join(' ')
  return { challenge: toChallenge(text), stage }
}

export const homePositionBasicTask: TypingTask = {
  id: 'home-position-basic',
  label: 'ホームポジション練習（時間制）',
  generate: () => nextLine(0).challenge,
  endless: {
    next: ({ clearedLines }) => nextLine(clearedLines),
  },
}

register(homePositionBasicTask)
