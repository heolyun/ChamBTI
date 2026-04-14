import { getChampionById, getChampionBySlug } from '../data/champions'
import { questions } from '../data/questions'
import type {
  ChampionProfile,
  HydratedResult,
  Recommendation,
  StoredResult,
  TraitKey,
  TraitProfile,
} from '../types/champion'
import { traitKeys } from '../types/champion'

const traitReasonMap: Record<TraitKey, { high: string; low: string }> = {
  aggression: {
    high: '교전을 먼저 열고 주도권을 잡는 성향과 잘 맞아요.',
    low: '무리한 올인보다 안정적인 운영을 선호하는 흐름과 잘 맞아요.',
  },
  mobility: {
    high: '기동력으로 각을 만드는 플레이를 즐기는 편이라 궁합이 좋아요.',
    low: '이동기 의존도보다 위치 선정 중심 플레이에 더 잘 맞아요.',
  },
  range: {
    high: '안전한 거리에서 압박하고 딜하는 스타일과 잘 어울립니다.',
    low: '가까운 거리에서 존재감을 내는 전투 취향과 맞물립니다.',
  },
  durability: {
    high: '앞라인에서 버티거나 먼저 받아내는 플레이 감각과 잘 맞아요.',
    low: '단단함보다 딜 각과 전투 템포를 중시하는 성향과 잘 맞아요.',
  },
  control: {
    high: 'CC와 변수 창출을 중시하는 성향이 추천에 강하게 반영됐어요.',
    low: '유틸보다는 직접적인 화력과 템포를 살리는 쪽에 더 가깝습니다.',
  },
  execution: {
    high: '손맛 있는 콤보와 숙련도 보상을 원하는 취향에 잘 맞아요.',
    low: '직관적이고 입문 난이도가 낮은 챔피언 선호에 어울려요.',
  },
}

export const defaultPreferences: TraitProfile = {
  aggression: 3,
  mobility: 3,
  range: 3,
  durability: 3,
  control: 3,
  execution: 3,
}

export function mergePreferencesFromAnswers(answers: Record<string, string>) {
  const nextPreferences = { ...defaultPreferences }

  for (const question of questions) {
    const selectedOptionId = answers[question.id]
    const option = question.options.find((candidate) => candidate.id === selectedOptionId)

    if (!option) {
      continue
    }

    for (const trait of traitKeys) {
      const delta = option.delta[trait] ?? 0
      nextPreferences[trait] = clamp(nextPreferences[trait] + delta, 1, 5)
    }
  }

  return nextPreferences
}

export function getRecommendations(
  champions: ChampionProfile[],
  preferences: TraitProfile,
  limit = 3,
) {
  return [...champions]
    .map((champion) => scoreChampion(champion, preferences))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}

export function buildStoredResult(
  answers: Record<string, string>,
  preferences: TraitProfile,
  recommendations: Recommendation[],
): StoredResult {
  return {
    shareSlug: recommendations[0]?.champion.slug ?? 'ahri',
    createdAt: new Date().toISOString(),
    answers,
    preferences,
    recommendations: recommendations.map((recommendation) => ({
      championId: recommendation.champion.id,
      score: recommendation.score,
      fitLabel: recommendation.fitLabel,
      reasons: recommendation.reasons,
    })),
  }
}

export function hydrateStoredResult(
  storedResult: StoredResult,
  champions: ChampionProfile[],
): HydratedResult | null {
  const recommendations = storedResult.recommendations
    .map((entry) => {
      const champion = getChampionById(champions, entry.championId)

      if (!champion) {
        return null
      }

      return {
        champion,
        score: entry.score,
        fitLabel: entry.fitLabel,
        reasons: entry.reasons,
      }
    })
    .filter((entry): entry is Recommendation => entry !== null)

  if (recommendations.length === 0) {
    return null
  }

  return {
    recommendations,
    similarChampions: getSimilarChampions(champions, recommendations[0].champion.id, 3),
  }
}

export function buildGenericSharedResult(
  champions: ChampionProfile[],
  slug: string,
): HydratedResult | null {
  const champion = getChampionBySlug(champions, slug)

  if (!champion) {
    return null
  }

  const recommendations: Recommendation[] = [
    scoreChampion(champion, champion.profile),
    ...getSimilarChampions(champions, champion.id, 2).map((candidate) =>
      scoreChampion(candidate, champion.profile),
    ),
  ]

  return {
    recommendations,
    similarChampions: getSimilarChampions(champions, champion.id, 3),
  }
}

export function getSimilarChampions(
  champions: ChampionProfile[],
  championId: string,
  limit = 3,
) {
  const champion = getChampionById(champions, championId)

  if (!champion) {
    return []
  }

  return champions
    .filter((candidate) => candidate.id !== championId)
    .map((candidate) => ({
      champion: candidate,
      distance: getProfileDistance(champion.profile, candidate.profile),
      sharedClasses: candidate.classes.filter((item) =>
        champion.classes.includes(item),
      ).length,
    }))
    .sort((left, right) => {
      if (right.sharedClasses !== left.sharedClasses) {
        return right.sharedClasses - left.sharedClasses
      }

      return left.distance - right.distance
    })
    .map((item) => item.champion)
    .slice(0, limit)
}

function scoreChampion(champion: ChampionProfile, preferences: TraitProfile): Recommendation {
  const traitDetails = traitKeys.map((trait) => {
    const preference = preferences[trait]
    const championValue = champion.profile[trait]
    const closeness = 6 - Math.abs(preference - championValue)
    const weight = 1 + Math.abs(preference - 3) * 0.35

    return {
      trait,
      closeness,
      weightedScore: closeness * weight,
      preference,
    }
  })

  const score = Number(
    traitDetails
      .reduce((total, traitDetail) => total + traitDetail.weightedScore, 0)
      .toFixed(2),
  )

  const reasons = traitDetails
    .sort((left, right) => right.weightedScore - left.weightedScore)
    .slice(0, 3)
    .map((traitDetail) =>
      traitDetail.preference >= 3
        ? traitReasonMap[traitDetail.trait].high
        : traitReasonMap[traitDetail.trait].low,
    )

  return {
    champion,
    score,
    fitLabel: getFitLabel(score),
    reasons,
  }
}

function getFitLabel(score: number) {
  if (score >= 29) {
    return '찰떡 궁합'
  }

  if (score >= 26) {
    return '잘 맞는 픽'
  }

  return '연습 가치 높음'
}

function getProfileDistance(left: TraitProfile, right: TraitProfile) {
  return traitKeys.reduce(
    (total, trait) => total + Math.abs(left[trait] - right[trait]),
    0,
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
