import { useEffect, useState } from 'react'
import { fetchChampionCatalog } from '../data/champions'
import type { ChampionCatalog } from '../types/champion'

export function useChampionCatalog() {
  const [catalog, setCatalog] = useState<ChampionCatalog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function loadCatalog() {
      setIsLoading(true)
      setHasError(false)

      try {
        const nextCatalog = await fetchChampionCatalog()

        if (!isCancelled) {
          setCatalog(nextCatalog)
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

    void loadCatalog()

    return () => {
      isCancelled = true
    }
  }, [])

  return {
    catalog,
    isLoading,
    hasError,
  }
}
