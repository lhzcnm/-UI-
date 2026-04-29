import { useWebSocket } from "@vueuse/core"
import { toast } from "vue-sonner"

type WebSocketType =
  | 'info'
  | 'battery'
  | 'screenshot'
  | 'print'
  | 'activation'
  | 'deactivate'
  | 'enterRecoveryMode'
  | 'exitRecoveryMode'
  | 'reboot'
  | 'shutdown'
  | 'mountImage'
  | 'recoveryInfo'
  | 'pluginInfo'

interface WebSocketParams {
  type                   : WebSocketType

  Uid                   ?: string
  DeviceName            ?: string
  ModelNumber           ?: string
  MLBSerialNumber       ?: string
  Imei                  ?: string
  Color                 ?: string
  CycleCount            ?: number
  RegionInfo            ?: string
  ProductVersion        ?: string
  TotalDiskCapacity     ?: number
  NominalChargeCapacity ?: number
  DesignCapacity        ?: number
  TemplateId            ?: number
}

interface WebSocketHandler {
  resolve: (data: any) => void
  reject: (data: any) => void
}

export const messageHandlers = new Map<string, WebSocketHandler>()

export const ws = useWebSocket(
  'ws://localhost:10000/ws',
  {
    autoReconnect: {
      delay: 2000,
      retries: 3
    },
    heartbeat: {
      interval: 30000,
      pongTimeout: 3000,
      responseMessage: 'pong',
    },
    onMessage: (_, event) => {
      if (!event.data.startsWith('{"id"')) return

      const response = JSON.parse(event.data)
      const handler = messageHandlers.get(response.id)

      if (!handler) return

      if (response.code === 200) {
        handler.resolve(response.data)
      } else {
        toast.warning(response.message)
        handler.reject(new Error(response.message))
      }

      messageHandlers.delete(response.id)
    }
  }
)

export function wsFetch<T>(params: WebSocketParams) {
  return new Promise<T>((resolve, reject) => {
    if (ws.status.value !== 'OPEN') {
      reject(new Error('WebSocket is not connected'))
      return
    }

    const id = getRequestId()
    ws.send(JSON.stringify({ ...params, id }))
    messageHandlers.set(id, { resolve, reject })
  })
}

function getRequestId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9)
}
