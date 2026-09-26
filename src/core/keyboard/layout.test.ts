import { describe, expect, it } from 'vitest'
import { fingerLabel, fingerOf, KEYBOARD_ROWS } from './layout.ts'

describe('keyboard/layout', () => {
  it('下3段は10キーずつで、数字を含まない', () => {
    expect(KEYBOARD_ROWS).toHaveLength(3)
    for (const row of KEYBOARD_ROWS) {
      expect(row).toHaveLength(10)
      expect(row.some((key) => /[0-9]/.test(key))).toBe(false)
    }
  })

  it('下3段のすべてのキーに指が割り当たっている', () => {
    for (const key of KEYBOARD_ROWS.flat()) {
      expect(fingerOf(key)).toBeDefined()
    }
  })

  it('同じ列のキーは同じ指で打つ', () => {
    expect(fingerOf('q')).toEqual({ hand: 'left', finger: 'pinky' })
    expect(fingerOf('a')).toEqual({ hand: 'left', finger: 'pinky' })
    expect(fingerOf('z')).toEqual({ hand: 'left', finger: 'pinky' })
    expect(fingerOf('/')).toEqual({ hand: 'right', finger: 'pinky' })
    expect(fingerOf('t')).toEqual({ hand: 'left', finger: 'index' })
    expect(fingerOf('n')).toEqual({ hand: 'right', finger: 'index' })
  })

  it('大文字でも引ける', () => {
    expect(fingerOf('D')).toEqual(fingerOf('d'))
  })

  it('指のラベルを「手・指」で返す', () => {
    expect(fingerLabel('d')).toBe('左手・中指')
    expect(fingerLabel('k')).toBe('右手・中指')
    expect(fingerLabel(';')).toBe('右手・小指')
    expect(fingerLabel('g')).toBe('左手・人さし指')
  })

  it('スペースは親指', () => {
    expect(fingerOf(' ')?.finger).toBe('thumb')
    expect(fingerLabel(' ')).toBe('親指')
  })

  it('下3段にないキーは undefined', () => {
    expect(fingerOf('1')).toBeUndefined()
    expect(fingerLabel('@')).toBeUndefined()
  })
})
