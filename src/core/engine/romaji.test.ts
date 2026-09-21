import { describe, expect, it } from 'vitest'
import { kanaToUnits } from './romaji.ts'

describe('kanaToUnits', () => {
  it('「し」を shi でも si でも正解にする', () => {
    const units = kanaToUnits('し')
    expect(units).toEqual([{ display: 'し', accepted: ['shi', 'si'] }])
  })

  it('複数モーラを1文字ずつのユニットに分割する', () => {
    const units = kanaToUnits('した')
    expect(units).toEqual([
      { display: 'し', accepted: ['shi', 'si'] },
      { display: 'た', accepted: ['ta'] },
    ])
  })

  it('拗音（きゃ等）を1ユニットとして扱う', () => {
    const units = kanaToUnits('きゃく')
    expect(units).toEqual([
      { display: 'きゃ', accepted: ['kya'] },
      { display: 'く', accepted: ['ku'] },
    ])
  })

  it('促音（っ）は次の子音を重ねたユニットにする', () => {
    const units = kanaToUnits('がっこう')
    expect(units).toEqual([
      { display: 'が', accepted: ['ga'] },
      { display: 'っこ', accepted: ['kko'] },
      { display: 'う', accepted: ['u'] },
    ])
  })

  it('未対応のかなはエラーにする', () => {
    expect(() => kanaToUnits('ー')).toThrow()
  })
})
