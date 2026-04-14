import { useEffect, useState } from 'react'
import { getChampionDetailUrl } from '../data/champions'
import type { ChampionRemoteDetailMap } from '../types/champion'

type RemoteChampionResponse = {
  data: Record<
    string,
    {
      blurb: string
      passive: {
        name: string
      }
      spells: Array<{
        name: string
      }>
    }
  >
}

export function useChampionDetails(ids: string[], version: string | null) {
  const [details, setDetails] = useState<ChampionRemoteDetailMap>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const idsKey = [...new Set(ids)].filter(Boolean).join('|')

  useEffect(() => {
    if (!version) {
      return
    }

    const activeVersion = version
    const uniqueIds = idsKey ? idsKey.split('|') : []

    if (uniqueIds.length === 0) {
      return
    }

    let isCancelled = false

    async function loadDetails() {
      setIsLoading(true)
      setHasError(false)

      try {
        const responses = await Promise.all(
          uniqueIds.map(async (id) => {
            const response = await fetch(getChampionDetailUrl(activeVersion, id))

            if (!response.ok) {
              throw new Error(`Failed to load champion detail for ${id}`)
            }

            const payload = (await response.json()) as RemoteChampionResponse
            const champion = payload.data[id]

            return {
              id,
              blurb: champion.blurb,
              skills: {
                passive: champion.passive.name,
                q: champion.spells[0]?.name ?? 'Q',
                w: champion.spells[1]?.name ?? 'W',
                e: champion.spells[2]?.name ?? 'E',
                r: champion.spells[3]?.name ?? 'R',
              },
            }
          }),
        )

        if (!isCancelled) {
          const nextDetails = responses.reduce<ChampionRemoteDetailMap>(
            (accumulator, item) => {
              accumulator[item.id] = {
                blurb: item.blurb,
                skills: item.skills,
              }
              return accumulator
            },
            {},
          )

          setDetails(nextDetails)
        }
      } catch {
        if (!isCancelled) {
          setHasError(true)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadDetails()

    return () => {
      isCancelled = true
    }
  }, [idsKey, version])

  return {
    details,
    hasError,
    isLoading,
  }
}
