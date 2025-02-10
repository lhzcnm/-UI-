import type { R } from '@3un/shared'

export enum StorageType {
  Session = 'session',
  Local = 'local'
}

export interface FetchWithCacheOptions<T> {
  key: string
  force?: boolean
  waitTime?: number
  cacheDuration?: number
  storageType?: StorageType
  fetchData: () => R<T>
  onUpdate?: (data: T) => void
  onError?: (error: Error) => void
}

const cacheManager = {
  getStorage(type: StorageType = StorageType.Session) {
    return type === StorageType.Session ? sessionStorage : localStorage
  },

  clearExpired(storage = sessionStorage) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (!key) continue

      try {
        const cached = JSON.parse(storage.getItem(key) || '')
        if (Date.now() - cached.time > cached.duration) {
          storage.removeItem(key)
        }
      } catch (e) {
        console.warn(`Clear cache error: ${key}`, e)
      }
    }
  }
}

export async function useFetchWithCache<T>(
  options: FetchWithCacheOptions<T>
): Promise<T> {
  const {
    key,
    fetchData,
    onUpdate,
    onError,
    force = false,
    waitTime = 500,
    cacheDuration = 300 * 1000,
    storageType = StorageType.Session
  } = options

  const storage = cacheManager.getStorage(storageType)

  try {
    cacheManager.clearExpired(storage)

    const cachedData = storage.getItem(key)
    if (cachedData && !force) {
      const { data, time } = JSON.parse(cachedData)
      const now = Date.now()
      if (now - time < cacheDuration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(data), waitTime)
        })
      }
    }

    const fetchStart = Date.now()
    const { data } = await fetchData()
    const fetchTime = Date.now() - fetchStart
    const _waitTime = fetchTime < waitTime ? waitTime - fetchTime : 0

    storage.setItem(key, JSON.stringify({ 
      data, 
      time: fetchStart,
      duration: cacheDuration
    }))
    
    onUpdate?.(data)

    return new Promise((resolve) => {
      setTimeout(() => resolve(data), _waitTime)
    })

  } catch (error) {
    onError?.(error as Error)
    throw error
  }
}

export const clearCache = (storageType = StorageType.Session) => {
  cacheManager.clearExpired(cacheManager.getStorage(storageType))
}
