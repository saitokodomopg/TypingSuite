export type ChallengeUnit = {
  display: string
  accepted: string[]
}

export type Challenge = {
  displayText: string
  units: ChallengeUnit[]
}
