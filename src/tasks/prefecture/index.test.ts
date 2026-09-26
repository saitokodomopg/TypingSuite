import { describe, expect, it } from 'vitest'
import { get, list } from '../../core/registry/registry.ts'
import {
  buildPrefectureChallenge,
  PREFECTURES,
  pickRandomPrefectures,
  prefectureTask,
} from './index.ts'

describe('prefecture task', () => {
  it('registryに登録される', () => {
    expect(list().map((task) => task.id)).toContain('prefecture')
    expect(get('prefecture')).toBe(prefectureTask)
  })

  it('47都道府県すべてを持つ', () => {
    expect(PREFECTURES).toHaveLength(47)
    expect(new Set(PREFECTURES.map((p) => p.name)).size).toBe(47)
  })

  it('重複なく指定件数を抽選する', () => {
    const picked = pickRandomPrefectures(5)

    expect(picked).toHaveLength(5)
    expect(new Set(picked.map((p) => p.name)).size).toBe(5)
  })

  it('複数の都道府県を続けて1つの課題にする', () => {
    const challenge = buildPrefectureChallenge([
      { name: '東京都', kana: 'とうきょうと' },
      { name: '大阪府', kana: 'おおさかふ' },
    ])

    expect(challenge.displayText).toBe('東京都　大阪府')
    expect(challenge.units.map((unit) => unit.display).join('')).toBe(
      'とうきょうとおおさかふ',
    )
  })

  it('生成した課題は複数の打ち方を許容する（しゃ行など）', () => {
    const challenge = buildPrefectureChallenge([{ name: '静岡県', kana: 'しずおかけん' }])
    const shiUnit = challenge.units[0]

    expect(shiUnit.accepted).toEqual(expect.arrayContaining(['shi', 'si']))
  })

  it('generate()は毎回5件の課題を返す', () => {
    const challenge = prefectureTask.generate()

    expect(challenge.displayText.split('　')).toHaveLength(5)
  })
})
