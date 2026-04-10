import axios from "axios"
import { toast } from "vue-sonner"

const tokenStorageKey = import.meta.env.VITE_ACCESS_TOKEN
const tokenExpireTimeKey = import.meta.env.VITE_TOKEN_EXPIRE_TIME

let isHeartBeatRunning = false
let heartBeatPromise: Promise<boolean> | null = null
let heartBeatTimer: number | null = null

async function authHeartBeat() {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/user/heartbeat`, {
      headers: {
        Authorization: localStorage.getItem(tokenStorageKey) || '',
      },
    })
    return true
  } catch {
    return false
  } 
}

function isTokenNearExpire() {
  const expireAt = Number(localStorage.getItem(tokenExpireTimeKey))
  if (!expireAt) return true

  const now = Date.now()
  return expireAt - now < 20 * 1000
}

export function getToken() {
  return localStorage.getItem(tokenStorageKey)
}

export function setToken(token: string, expireAt?: number) {
  localStorage.setItem(tokenStorageKey, token)

  if (expireAt) {
    localStorage.setItem(tokenExpireTimeKey, expireAt.toString())
  }
}

export async function processHeartBeat() {
  if (isTokenNearExpire()) {
    if (!isHeartBeatRunning) {
      isHeartBeatRunning = true

      heartBeatPromise = authHeartBeat()
    }

    if (!await heartBeatPromise) {
      handleUnauthorized()
      throw new Error("Unauthorized")
    }

    isHeartBeatRunning = false

    const nextExpireAt = Date.now() + 10 * 60 * 1000
    // const nextExpireAt = Date.now() + 60 * 1000
    setToken(getToken() || '', nextExpireAt)
  }
}

export async function handleUnauthorized() {
  toast.warning('身份认证过期，请重新登录')

  localStorage.clear()
  sessionStorage.clear()
  window.location.reload()
}

export function startHeartBeatScheduler() {
  if (heartBeatTimer) return

  heartBeatTimer = window.setInterval(async () => {
    try {
      if (!getToken()) return

      console.log('Checking token heartbeat...')

      if (!isTokenNearExpire()) return

      await processHeartBeat()
    } catch {
      console.error('Heartbeat failed, stopping scheduler.')
    }
  }, 10 * 1000)
}

export function stopHeartBeatScheduler() {
  if (heartBeatTimer) {
    clearInterval(heartBeatTimer)
    heartBeatTimer = null
  }
}
