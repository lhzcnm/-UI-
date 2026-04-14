type Message = {
  type: string,
  payload?: any,
  timestamp: number,
  tabId: string,
}

export class CrossTabChannel {
  private channel?: BroadcastChannel
  private key: string
  private listeners: ((msg: Message) => void)[] = []
  private storageHandler?: (e: StorageEvent) => void
  private tabId: string

  constructor(key: string, tabId: string) {
    this.key = key
    this.tabId = tabId

    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(key)

      this.channel.onmessage = (e) => {
        const msg: Message = e.data
        if (msg.tabId === this.tabId) return
        this.emit(e.data)
      }
    } else {
      this.storageHandler = (e) => {
        if (e.key === this.key && e.newValue) {
          const msg: Message = JSON.parse(e.newValue)
          if (msg.tabId === this.tabId) return
          this.emit(msg)
        }
      }
      globalThis.addEventListener('storage', this.storageHandler)
    }
  }

  send(msg: Message) {
    const data: Message = {
      ...msg,
      timestamp: Date.now(),
      tabId: this.tabId
    }
    if (this.channel) {
      this.channel.postMessage(data)
    } else {
      localStorage.setItem(this.key, JSON.stringify(data))
      localStorage.removeItem(this.key)
    }
  }

  onMessage(cb: (msg: Message) => void) {
    this.listeners.push(cb)
  }

  private emit(msg: Message) {
    this.listeners.forEach(cb => cb(msg))
  }

  close() {
    this.channel?.close()

    if (this.storageHandler) {
      globalThis.removeEventListener('storage', this.storageHandler)
    }
  }
}
