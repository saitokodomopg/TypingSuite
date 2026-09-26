import { kanaToUnits } from '../../core/engine/romaji.ts'
import type { TypingTask } from '../../core/types/task.ts'
import { register } from '../../core/registry/registry.ts'

const phrases = [
  { kanji: '石の上にも三年', reading: 'いしのうえにもさんねん' },
  { kanji: '猿も木から落ちる', reading: 'さるもきからおちる' },
  { kanji: '七転び八起き', reading: 'ななころびやおき' },
  { kanji: '猫に小判', reading: 'ねこにこばん' },
  { kanji: '花より団子', reading: 'はなよりだんご' },
  { kanji: '塵も積もれば山となる', reading: 'ちりもつもればやまとなる' },
  { kanji: '一石二鳥', reading: 'いっせきにちょう' },
  { kanji: '一期一会', reading: 'いちごいちえ' },
  { kanji: '温故知新', reading: 'おんこちしん' },
  { kanji: '因果応報', reading: 'いんがおうほう' },
  { kanji: '自業自得', reading: 'じごうじとく' },
  { kanji: '臨機応変', reading: 'りんきおうへん' },
]

export const kotowazaYojijukugoTask: TypingTask = {
  id: 'kotowaza-yojijukugo',
  label: 'ことわざ・四字熟語打ち',
  generate: () => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    return {
      displayText: phrase.kanji,
      units: kanaToUnits(phrase.reading),
    }
  },
}

register(kotowazaYojijukugoTask)
