import type { ChallengeUnit } from '../types/challenge.ts'

const TABLE: Record<string, string[]> = {
  あ: ['a'],
  い: ['i'],
  う: ['u'],
  え: ['e'],
  お: ['o'],
  か: ['ka'],
  き: ['ki'],
  く: ['ku'],
  け: ['ke'],
  こ: ['ko'],
  が: ['ga'],
  ぎ: ['gi'],
  ぐ: ['gu'],
  げ: ['ge'],
  ご: ['go'],
  さ: ['sa'],
  し: ['shi', 'si'],
  す: ['su'],
  せ: ['se'],
  そ: ['so'],
  ざ: ['za'],
  じ: ['ji', 'zi'],
  ず: ['zu'],
  ぜ: ['ze'],
  ぞ: ['zo'],
  た: ['ta'],
  ち: ['chi', 'ti'],
  つ: ['tsu', 'tu'],
  て: ['te'],
  と: ['to'],
  だ: ['da'],
  ぢ: ['ji', 'di'],
  づ: ['zu', 'du'],
  で: ['de'],
  ど: ['do'],
  な: ['na'],
  に: ['ni'],
  ぬ: ['nu'],
  ね: ['ne'],
  の: ['no'],
  は: ['ha'],
  ひ: ['hi'],
  ふ: ['fu', 'hu'],
  へ: ['he'],
  ほ: ['ho'],
  ば: ['ba'],
  び: ['bi'],
  ぶ: ['bu'],
  べ: ['be'],
  ぼ: ['bo'],
  ぱ: ['pa'],
  ぴ: ['pi'],
  ぷ: ['pu'],
  ぺ: ['pe'],
  ぽ: ['po'],
  ま: ['ma'],
  み: ['mi'],
  む: ['mu'],
  め: ['me'],
  も: ['mo'],
  や: ['ya'],
  ゆ: ['yu'],
  よ: ['yo'],
  ら: ['ra'],
  り: ['ri'],
  る: ['ru'],
  れ: ['re'],
  ろ: ['ro'],
  わ: ['wa'],
  を: ['wo'],
  ん: ['n', 'nn'],
  きゃ: ['kya'],
  きゅ: ['kyu'],
  きょ: ['kyo'],
  ぎゃ: ['gya'],
  ぎゅ: ['gyu'],
  ぎょ: ['gyo'],
  しゃ: ['sha', 'sya'],
  しゅ: ['shu', 'syu'],
  しょ: ['sho', 'syo'],
  じゃ: ['ja', 'zya'],
  じゅ: ['ju', 'zyu'],
  じょ: ['jo', 'zyo'],
  ちゃ: ['cha', 'tya'],
  ちゅ: ['chu', 'tyu'],
  ちょ: ['cho', 'tyo'],
  にゃ: ['nya'],
  にゅ: ['nyu'],
  にょ: ['nyo'],
  ひゃ: ['hya'],
  ひゅ: ['hyu'],
  ひょ: ['hyo'],
  びゃ: ['bya'],
  びゅ: ['byu'],
  びょ: ['byo'],
  ぴゃ: ['pya'],
  ぴゅ: ['pyu'],
  ぴょ: ['pyo'],
  みゃ: ['mya'],
  みゅ: ['myu'],
  みょ: ['myo'],
  りゃ: ['rya'],
  りゅ: ['ryu'],
  りょ: ['ryo'],
}

const SOKUON = 'っ'

type Mora = {
  display: string
  accepted: string[]
  length: number
}

function resolveMora(kana: string, i: number): Mora {
  const twoChar = kana.slice(i, i + 2)
  const twoCharAccepted = TABLE[twoChar]
  if (twoCharAccepted) {
    return { display: twoChar, accepted: twoCharAccepted, length: 2 }
  }
  const oneChar = kana[i]
  const accepted = TABLE[oneChar]
  if (!accepted) {
    throw new Error(`未対応のかな: ${oneChar}`)
  }
  return { display: oneChar, accepted, length: 1 }
}

export function kanaToUnits(kana: string): ChallengeUnit[] {
  const units: ChallengeUnit[] = []
  let i = 0
  while (i < kana.length) {
    if (kana[i] === SOKUON && i + 1 < kana.length) {
      const next = resolveMora(kana, i + 1)
      units.push({
        display: SOKUON + next.display,
        accepted: next.accepted.map((romaji) => romaji[0] + romaji),
      })
      i += 1 + next.length
      continue
    }
    const mora = resolveMora(kana, i)
    units.push({ display: mora.display, accepted: mora.accepted })
    i += mora.length
  }
  return units
}
