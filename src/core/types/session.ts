export type KeyMiss = {
  key: string
  count: number
}

export type Session = {
  speed: number
  accuracy: number
  durationMs: number
  keyMisses: KeyMiss[]
}
