export type Hand = 'left' | 'right'
export type Finger = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'

export type FingerAssignment = { hand: Hand; finger: Finger }

// 数字の段を除く下3段（上段・中段・下段）
export const KEYBOARD_ROWS: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

// 左から順に、各列を打つ指
const COLUMN_FINGERS: FingerAssignment[] = [
  { hand: 'left', finger: 'pinky' },
  { hand: 'left', finger: 'ring' },
  { hand: 'left', finger: 'middle' },
  { hand: 'left', finger: 'index' },
  { hand: 'left', finger: 'index' },
  { hand: 'right', finger: 'index' },
  { hand: 'right', finger: 'index' },
  { hand: 'right', finger: 'middle' },
  { hand: 'right', finger: 'ring' },
  { hand: 'right', finger: 'pinky' },
]

const HAND_LABELS: Record<Hand, string> = { left: '左手', right: '右手' }

const FINGER_LABELS: Record<Finger, string> = {
  pinky: '小指',
  ring: '薬指',
  middle: '中指',
  index: '人さし指',
  thumb: '親指',
}

export function fingerOf(key: string): FingerAssignment | undefined {
  if (key === ' ') {
    return { hand: 'left', finger: 'thumb' }
  }
  const lower = key.toLowerCase()
  for (const row of KEYBOARD_ROWS) {
    const column = row.indexOf(lower)
    if (column >= 0) {
      return COLUMN_FINGERS[column]
    }
  }
  return undefined
}

// 例：「左手・中指」。スペースはどちらの手でもよいので「親指」
export function fingerLabel(key: string): string | undefined {
  const assignment = fingerOf(key)
  if (!assignment) {
    return undefined
  }
  if (assignment.finger === 'thumb') {
    return FINGER_LABELS.thumb
  }
  return `${HAND_LABELS[assignment.hand]}・${FINGER_LABELS[assignment.finger]}`
}
