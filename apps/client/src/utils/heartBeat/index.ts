import { toast } from 'vue-sonner'

import { CrossTabChannel } from './channel'
import http from '../http'

export * from './channel'

const events = [
  "click",
  "mousemove",
  "keydown",
  "scroll",
  "visibilitychange"
]
const INACTIVE_TIME = 5 * 60 * 1000
const REFRESH_INTERVAL = 10 * 60 * 1000
export const CHECK_INTERVAL = 30 * 1000
const tabId = Math.random().toString(36).slice(2)

export const visibleInacvite = ref<boolean>(false)

let channel: CrossTabChannel | null = null
let timer: number | null = null
let lastActiveTime = Date.now()
let lastRefreshTime = Date.now()
let lastUpdate = 0
let inactiveCount = 0
let isLogouting = false
let isRefreshing = false

export function startChannel() {
  // console.log('starting channel')
  if (channel) return

  channel = new CrossTabChannel("AUTH_CHANNEL", tabId)

  channel.onMessage((msg) => {
    if (msg.type === 'REFRESH_TOKEN') {
      lastRefreshTime = msg.timestamp
    }

    if (msg.type === 'LOGOUT') {
      handleUnauthorized()
    }
  })

  events.forEach(event => {
    if (event === 'visibilitychange') {
      window.addEventListener(event, handleVisibillity)
    } else {
      window.addEventListener(event, updateActive)
    }
  })

  timer = window.setInterval(async () => {
    // console.log('checking heartbeat')
    const now = Date.now()

    if (now - lastActiveTime > INACTIVE_TIME) {
      console.log('detect user not active')
      visibleInacvite.value = true
      if (inactiveCount >= 3) {
        await logout()
        handleUnauthorized()
        return
      }
      inactiveCount++
      return
    }

    inactiveCount = 0

    // const shouldRefresh = 
    //   now - lastActiveTime < INACTIVE_TIME &&
    //   now - lastRefreshTime > REFRESH_INTERVAL

    if (isShouleRefresh() && !isRefreshing) {
      try {
        isRefreshing = true
        // console.log('refresh token')

        await heartcheck()

        lastRefreshTime = now
      } catch(err) {
        console.error('refresh token failed', err)
        handleUnauthorized()
      } finally {
        isRefreshing = false
      }
    }
  }, CHECK_INTERVAL)
}

export function closeChannel() {
  channel?.close()
  channel = null

  if (timer) {
    clearInterval(timer)
    timer = null
  }

  events.forEach(event => {
    if (event === 'visibilitychange') {
      window.removeEventListener(event, handleVisibillity)
    } else {
      window.removeEventListener(event, updateActive)
    }
  })
}

export async function handleUnauthorized() {
  if (isLogouting) return
  isLogouting = true
  // console.log('force logout')

  channel?.send({
    type: 'LOGOUT',
    payload: null,
    timestamp: Date.now(),
    tabId: tabId,
  })

  toast.warning("身份认证过期, 请重新登录")

  inactiveCount = 0
  localStorage.clear()
  sessionStorage.clear()
  closeChannel()
  window.location.href = '/auth'
}

export function getToken(key: string) {
  return localStorage.getItem(key)
}

async function updateActive() {
  const now = Date.now()

  if (now - lastUpdate < 1000) return

  if (isShouleRefresh() && !isRefreshing) {
    try {
      isRefreshing = true
      // console.log('refresh token')

      await heartcheck()

      lastRefreshTime = now
    } catch(err) {
      console.error('refresh token failed', err)
      handleUnauthorized()
    } finally {
      isRefreshing = false
    }
  }

  lastUpdate = now
  lastActiveTime = now
  visibleInacvite.value = false
}

function handleVisibillity() {
  if (!document.hidden) {
    updateActive()
  }
}

async function heartcheck() {
  channel?.send({
    type: 'REFRESH_TOKEN',
    payload: null,
    timestamp: Date.now(),
    tabId: tabId,
  })
  await http.get('/user/heartbeat/check', { params: { lastActivity: lastActiveTime } })
}

async function logout() {
  await http.post('/user/logout')
}

function isShouleRefresh() {
  const now = Date.now()

  return now - lastActiveTime < INACTIVE_TIME &&
      now - lastRefreshTime > REFRESH_INTERVAL
}
