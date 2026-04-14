import type { StoredResult } from '../types/champion'

const RESULT_STORAGE_KEY = 'chambti:last-result'

export function saveLastResult(result: StoredResult) {
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result))
}

export function loadLastResult() {
  const rawValue = localStorage.getItem(RESULT_STORAGE_KEY)
  if (!rawValue) return null

  try {
    return JSON.parse(rawValue) as StoredResult
  } catch {
    return null
  }
}
