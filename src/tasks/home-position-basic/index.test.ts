import { describe, expect, it } from 'vitest'
import { fingerOf } from '../../core/keyboard/layout.ts'
import {
  hasTripleRepeat,
  homePositionBasicTask,
  LINES_PER_STAGE,
  STAGE_KEYS,
} from './index.ts'

const TOTAL_LEVELS = STAGE_KEYS.length
// 乱数を含むため、各段階で何度も作って確かめる
const TRIALS = 200

const next = (clearedLines: number) =>
  homePositionBasicTask.endless!.next({ clearedLines })

// 段階 level の i 行目（0 始まり）を作るための打ち終えた行数
const linesFor = (level: number, i = 0) => (level - 1) * LINES_PER_STAGE + i

const sameFingerChunk = (chunk: string): boolean => {
  const fingers = chunk.split('').map((key) => fingerOf(key))
  const first = fingers[0]
  return (
    new Set(chunk).size >= 2 &&
    fingers.every(
      (f) => f && first && f.hand === first.hand && f.finger === first.finger,
    )
  )
}

describe('home-position-basic', () => {
  it('id は変わらず、endless を持つ', () => {
    expect(homePositionBasicTask.id).toBe('home-position-basic')
    expect(homePositionBasicTask.endless).toBeDefined()
  })

  it('generate は段階1の1行を返す', () => {
    for (let i = 0; i < TRIALS; i++) {
      const { displayText } = homePositionBasicTask.generate()
      expect(displayText.replaceAll(' ', '')).toMatch(/^[fj]+$/)
    }
  })

  it('最初は F と J だけが出る', () => {
    const { stage, challenge } = next(0)
    expect(stage.level).toBe(1)
    expect(stage.keys).toEqual(['f', 'j'])
    expect(challenge.displayText.replaceAll(' ', '')).toMatch(/^[fj]+$/)
  })

  it(`${LINES_PER_STAGE}行ごとに段階が1→${TOTAL_LEVELS}の順に上がり、最後の段階で止まる`, () => {
    for (let lines = 0; lines < LINES_PER_STAGE * (TOTAL_LEVELS + 3); lines++) {
      const expected = Math.min(
        TOTAL_LEVELS,
        Math.floor(lines / LINES_PER_STAGE) + 1,
      )
      const { stage } = next(lines)
      expect(stage.level).toBe(expected)
      expect(stage.totalLevels).toBe(TOTAL_LEVELS)
    }
  })

  it('段階が上がるたびにキーが増え、最後の段階では増えない', () => {
    expect(next(linesFor(6)).stage.newKeys).toEqual(['r', 'u', 'v', 'm'])
    expect(next(linesFor(6)).stage.keys).toHaveLength(14)
    expect(next(linesFor(TOTAL_LEVELS)).stage.newKeys).toEqual([])
    expect(next(linesFor(TOTAL_LEVELS)).stage.keys).toHaveLength(30)
  })

  it('各段階の出題は、その段階までのキーとスペースだけでできている', () => {
    for (let level = 1; level < TOTAL_LEVELS; level++) {
      for (let i = 0; i < TRIALS; i++) {
        const { challenge, stage } = next(linesFor(level, i % LINES_PER_STAGE))
        const allowed = new Set([...stage.keys, ' '])
        for (const unit of challenge.units) {
          expect(allowed.has(unit.accepted[0])).toBe(true)
        }
      }
    }
  })

  it('数字の段のキーが一度も出ない', () => {
    for (let level = 1; level <= TOTAL_LEVELS; level++) {
      for (let i = 0; i < TRIALS; i++) {
        const { challenge } = next(linesFor(level, i % LINES_PER_STAGE))
        expect(challenge.displayText).not.toMatch(/[0-9\-^\\=]/)
      }
    }
  })

  it('同じキーが3回以上続かない', () => {
    for (let level = 1; level <= TOTAL_LEVELS; level++) {
      for (let i = 0; i < TRIALS; i++) {
        const { challenge } = next(linesFor(level, i % LINES_PER_STAGE))
        expect(hasTripleRepeat(challenge.displayText)).toBe(false)
      }
    }
  })

  it('1行は3〜5文字のかたまり5個をスペースで区切ったもの', () => {
    for (let level = 1; level < TOTAL_LEVELS; level++) {
      const chunks = next(linesFor(level)).challenge.displayText.split(' ')
      expect(chunks).toHaveLength(5)
      for (const chunk of chunks) {
        expect(chunk.length).toBeGreaterThanOrEqual(3)
        expect(chunk.length).toBeLessThanOrEqual(5)
      }
    }
  })

  it('段階5以降は同じ指で打つキーをまとめたかたまりが含まれる', () => {
    for (let level = 5; level < TOTAL_LEVELS; level++) {
      for (let i = 0; i < 20; i++) {
        const chunks = next(linesFor(level)).challenge.displayText.split(' ')
        expect(chunks.some(sameFingerChunk)).toBe(true)
      }
    }
  })

  it('段階が上がった直後の行は、新しいキーを含むかたまりが多い', () => {
    for (let level = 1; level < TOTAL_LEVELS; level++) {
      const { challenge, stage } = next(linesFor(level))
      const chunks = challenge.displayText.split(' ')
      const withNewKey = chunks.filter((chunk) =>
        stage.newKeys.some((key) => chunk.includes(key)),
      )
      expect(withNewKey.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('最後の段階は英単語を出す', () => {
    const { challenge } = next(linesFor(TOTAL_LEVELS))
    const words = challenge.displayText.split(' ')
    expect(words).toHaveLength(5)
    for (const word of words) {
      expect(word).toMatch(/^[a-z]+$/)
    }
  })
})
