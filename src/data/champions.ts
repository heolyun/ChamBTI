import type { ChampionCatalog, ChampionProfile, TraitProfile } from '../types/champion'

const DATA_DRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com'
export const RIOT_LOCALE = 'ko_KR'

type RiotChampionSummary = {
  id: string
  name: string
  title: string
  blurb: string
  tags: string[]
  info: {
    attack: number
    defense: number
    magic: number
    difficulty: number
  }
  stats: {
    attackrange: number
    movespeed: number
  }
}

type RiotChampionListResponse = {
  data: Record<string, RiotChampionSummary>
}

const classLabelMap: Record<string, string> = {
  Assassin: '암살자',
  Fighter: '전사',
  Mage: '메이지',
  Marksman: '원거리 딜러',
  Support: '서포터',
  Tank: '탱커',
}

let cachedCatalog: ChampionCatalog | null = null
let catalogPromise: Promise<ChampionCatalog> | null = null

export async function fetchChampionCatalog() {
  if (cachedCatalog) {
    return cachedCatalog
  }

  if (catalogPromise) {
    return catalogPromise
  }

  catalogPromise = (async () => {
    const versionsResponse = await fetch(`${DATA_DRAGON_BASE_URL}/api/versions.json`)

    if (!versionsResponse.ok) {
      throw new Error('Failed to load Riot versions')
    }

    const versions = (await versionsResponse.json()) as string[]
    const latestVersion = versions[0]

    const championResponse = await fetch(
      `${DATA_DRAGON_BASE_URL}/cdn/${latestVersion}/data/${RIOT_LOCALE}/champion.json`,
    )

    if (!championResponse.ok) {
      throw new Error('Failed to load champion catalog')
    }

    const championPayload =
      (await championResponse.json()) as RiotChampionListResponse

    const champions = Object.values(championPayload.data)
      .map((champion) => mapChampionSummary(champion, latestVersion))
      .sort((left, right) => left.name.localeCompare(right.name, 'ko'))

    cachedCatalog = {
      version: latestVersion,
      champions,
    }

    return cachedCatalog
  })()

  try {
    return await catalogPromise
  } finally {
    catalogPromise = null
  }
}

export function getChampionBySlug(champions: ChampionProfile[], slug: string) {
  return champions.find((champion) => champion.slug === slug) ?? null
}

export function getChampionById(champions: ChampionProfile[], id: string) {
  return champions.find((champion) => champion.id === id) ?? null
}

export function getChampionSplashUrl(id: string) {
  return `${DATA_DRAGON_BASE_URL}/cdn/img/champion/loading/${id}_0.jpg`
}

export function getChampionSquareUrl(version: string, id: string) {
  return `${DATA_DRAGON_BASE_URL}/cdn/${version}/img/champion/${id}.png`
}

export function getChampionDetailUrl(version: string, id: string) {
  return `${DATA_DRAGON_BASE_URL}/cdn/${version}/data/${RIOT_LOCALE}/champion/${id}.json`
}

export function getDifficultyLabel(execution: number) {
  if (execution <= 2) {
    return '입문 추천'
  }

  if (execution === 3) {
    return '적당한 난이도'
  }

  return '손맛 강함'
}

function mapChampionSummary(
  champion: RiotChampionSummary,
  version: string,
): ChampionProfile {
  const classes = champion.tags.map((tag) => classLabelMap[tag] ?? tag)
  const profile = buildTraitProfile(champion)
  const tags = buildChampionTags(classes, profile)

  return {
    id: champion.id,
    slug: slugifyChampionId(champion.id),
    name: champion.name,
    title: champion.title,
    headline: `${champion.title} · ${classes.join(' / ')}`,
    classes,
    tags,
    summary: champion.blurb,
    guideQuery: `${champion.name} 공략`,
    dataVersion: version,
    profile,
    sourceTags: champion.tags,
    attackRange: champion.stats.attackrange,
  }
}

function buildTraitProfile(champion: RiotChampionSummary): TraitProfile {
  const { info, stats, tags } = champion
  const tagSet = new Set(tags)

  const aggression = clampToTraitScale(
    (info.attack + info.magic) / 2 +
      (tagSet.has('Assassin') ? 2 : 0) +
      (tagSet.has('Fighter') ? 1.4 : 0) +
      (tagSet.has('Marksman') ? 1 : 0) -
      (tagSet.has('Support') ? 1 : 0),
  )

  const durability = clampToTraitScale(
    info.defense +
      (tagSet.has('Tank') ? 3 : 0) +
      (tagSet.has('Fighter') ? 1.5 : 0) -
      (tagSet.has('Marksman') ? 1.5 : 0) -
      (tagSet.has('Mage') ? 0.5 : 0),
  )

  const control = clampToTraitScale(
    info.magic * 0.65 +
      info.defense * 0.2 +
      (tagSet.has('Support') ? 2.5 : 0) +
      (tagSet.has('Tank') ? 1.5 : 0) +
      (tagSet.has('Mage') ? 1.2 : 0) -
      (tagSet.has('Marksman') ? 1.2 : 0),
  )

  const execution = clampToTraitScale(
    info.difficulty +
      (tagSet.has('Assassin') ? 1.5 : 0) +
      (tagSet.has('Marksman') ? 0.5 : 0) -
      (tagSet.has('Tank') ? 0.5 : 0),
  )

  const mobilityBase =
    2 +
    (stats.movespeed >= 345 ? 1.2 : 0) +
    (stats.movespeed >= 335 ? 0.7 : 0) +
    (tagSet.has('Assassin') ? 1 : 0) +
    (tagSet.has('Fighter') ? 0.5 : 0) +
    (tagSet.has('Marksman') ? 0.25 : 0) -
    (tagSet.has('Tank') ? 0.35 : 0)

  return {
    aggression,
    mobility: clampToFixedTraitScale(mobilityBase),
    range: getRangeScore(stats.attackrange),
    durability,
    control,
    execution,
  }
}

function buildChampionTags(classes: string[], profile: TraitProfile) {
  const dynamicTags: string[] = []

  if (profile.range >= 4) {
    dynamicTags.push('장거리')
  } else if (profile.range <= 2) {
    dynamicTags.push('근접 압박')
  }

  if (profile.mobility >= 4) {
    dynamicTags.push('기동성')
  }

  if (profile.control >= 4) {
    dynamicTags.push('CC 강점')
  }

  if (profile.durability >= 4) {
    dynamicTags.push('단단함')
  }

  if (profile.execution >= 4) {
    dynamicTags.push('손맛')
  } else if (profile.execution <= 2) {
    dynamicTags.push('입문 추천')
  }

  return [...new Set([...classes, ...dynamicTags])].slice(0, 4)
}

function getRangeScore(attackRange: number) {
  if (attackRange <= 200) {
    return 1
  }

  if (attackRange <= 350) {
    return 2
  }

  if (attackRange <= 500) {
    return 3
  }

  if (attackRange <= 575) {
    return 4
  }

  return 5
}

function slugifyChampionId(id: string) {
  return id
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function clampToTraitScale(value: number) {
  return clampToFixedTraitScale(value / 2)
}

function clampToFixedTraitScale(value: number) {
  return Math.min(5, Math.max(1, Math.round(value)))
}
