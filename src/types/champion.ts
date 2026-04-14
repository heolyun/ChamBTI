export const traitKeys = [
  'aggression',
  'mobility',
  'range',
  'durability',
  'control',
  'execution',
] as const

export type TraitKey = (typeof traitKeys)[number]
export type TraitProfile = Record<TraitKey, number>

export type ChampionProfile = {
  id: string
  slug: string
  name: string
  title: string
  headline: string
  classes: string[]
  tags: string[]
  summary: string
  guideQuery: string
  dataVersion: string
  profile: TraitProfile
  sourceTags: string[]
  attackRange: number
}

export type ChampionCatalog = {
  version: string
  champions: ChampionProfile[]
}

export type QuestionOption = {
  id: string
  label: string
  description: string
  delta: Partial<Record<TraitKey, number>>
}

export type Question = {
  id: string
  prompt: string
  helper: string
  options: QuestionOption[]
}

export type Recommendation = {
  champion: ChampionProfile
  score: number
  fitLabel: string
  reasons: string[]
}

export type StoredRecommendation = {
  championId: string
  score: number
  fitLabel: string
  reasons: string[]
}

export type StoredResult = {
  shareSlug: string
  createdAt: string
  answers: Record<string, string>
  preferences: TraitProfile
  recommendations: StoredRecommendation[]
}

export type HydratedResult = {
  recommendations: Recommendation[]
  similarChampions: ChampionProfile[]
}

export type ChampionSkillSet = {
  passive: string
  q: string
  w: string
  e: string
  r: string
}

export type ChampionRemoteDetail = {
  blurb: string
  skills: ChampionSkillSet
}

export type ChampionRemoteDetailMap = Record<string, ChampionRemoteDetail>
