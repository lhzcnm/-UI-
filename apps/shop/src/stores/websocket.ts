import { useWebSocket } from "@vueuse/core"
import { defineStore } from "pinia"

interface WSConnectParams {
  [key: string]: string | number
  type: 'order'
}

export const useWsStore = defineStore('wsStore', () => {
  const webSocket = ref<any>(null)

  function qs(params: Record<string, string | number>) {
    return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')
  }

  function connect<T extends string>(params: WSConnectParams) {
    const baseUrl = import.meta.env.VITE_WS_URL
    const key = import.meta.env.VITE_GUEST_TOKEN
    const token = localStorage.getItem(key)

    const url = `${baseUrl}?token=${token}&${qs(params)}`
    const ws = useWebSocket<T>(url, {
      autoReconnect: true,
      heartbeat: {
        interval: 60000,
        pongTimeout: 10000,
        responseMessage: 'pong',
      }, 
    })

    webSocket.value = ws
    return ws
  }

  function close() {
    if(webSocket.value) webSocket.value.close()
  }

  return {
    connect,
    close,
  }
})