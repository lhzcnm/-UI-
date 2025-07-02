export enum StorageType {
  Session = 'session',
  Local   = 'local'
}

export interface FetchWithCacheOptions<T> {
  key            : string
  force         ?: boolean
  waitTime      ?: number
  cacheDuration ?: number
  storageType   ?: StorageType
  fetchFn        : () => Promise<T>
  onUpdate      ?: (data: T) => void
}

const cacheManager = {
  getStorage(type: StorageType = StorageType.Session) {
    return type === StorageType.Session ? sessionStorage : localStorage
  },
  clearExpired(storage = sessionStorage) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)

      if (!key || !key.startsWith('cache-')) continue

      try {
        const cached = JSON.parse(storage.getItem(key) || '')
        const dataKey = key.replace('cache-', '')

        if (Date.now() - cached.time > cached.duration) {
          storage.removeItem(dataKey)
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
    fetchFn,
    onUpdate,
    key,
    force         = false,
    waitTime      = 300,
    cacheDuration = 300 * 1000,
    storageType   = StorageType.Session
  } = options

  const storage = cacheManager.getStorage(storageType)
  cacheManager.clearExpired(storage)

  const cachedRawData = storage.getItem(key)
  const cachedData = storage.getItem(`cache-${key}`)
  if (cachedRawData && cachedData && !force) {
    const { time, duration } = JSON.parse(cachedData)
    const now = Date.now()

    if (now - time < duration) {
      const data = JSON.parse(cachedRawData)
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), waitTime)
      })
    }
  }

  const fetchStart = Date.now()
  const data = await fetchFn()
  const fetchTime = Date.now() - fetchStart
  const _waitTime = fetchTime < waitTime ? waitTime - fetchTime : 0

  storage.setItem(
    `cache-${key}`,
    JSON.stringify({
      time: fetchStart,
      duration: cacheDuration,
    })
  )

  storage.setItem(key, JSON.stringify(data))
  onUpdate?.(data)

  return new Promise((resolve) => {
    setTimeout(() => resolve(data), _waitTime)
  })
}

export const clearCache = (storageType = StorageType.Session) => {
  cacheManager.clearExpired(cacheManager.getStorage(storageType))
}
