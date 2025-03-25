import type { UseWebSocketReturn } from '@vueuse/core'
import { useWebSocket } from '@vueuse/core'
import { defineStore } from 'pinia'

interface WSConnectParams {
  [key: string]: string | number
  type: 'order'
}

export const useWsStore = defineStore('wsStore', () => {
  const baseUrl = import.meta.env.VITE_WS_URL
  const key = import.meta.env.VITE_ACCESS_TOKEN
  let wxCache: UseWebSocketReturn<any> | null = null

  function connect<T extends string>(params: WSConnectParams) {
    let token = localStorage.getItem(key)
    if (!token) token = sessionStorage.getItem(key)

    const url = `${baseUrl}?token=${token}&${qs(params)}`
    const ws = useWebSocket<T>(url, {
      autoReconnect: true,
      heartbeat: {
        interval: 60000,
        pongTimeout: 10000,
        responseMessage: 'pong',
      },
    })

    wxCache = ws
    return ws
  }

  function close() {
    if (wxCache) wxCache.close()
  }

  function qs(params: Record<string, string | number>) {
    return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')
  }

  return {
    wxCache,
    connect,
    close,
  }
})
