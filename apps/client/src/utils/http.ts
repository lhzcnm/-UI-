import type { AxiosError, AxiosResponse } from 'axios'
import type { CR } from '@3un/shared'

import { toast } from 'vue-sonner'
import axios from 'axios'
import { getToken, handleUnauthorized, processHeartBeat } from '.'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Authorization: getToken() },
  timeout: 5000 * 60,
})

http.interceptors.request.use(async (config) => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key)

  // console.log(config)
  // console.log(config.skipAuth)
  if (config.skipAuth) return config

  await processHeartBeat()

  config.headers.Authorization = token

  if(!config.headers['Accept-Language'])
  {
    const locale = localStorage.getItem('locale')
    config.headers['Accept-Language'] = locale ?? 'zh'
  }
  const storeKey = import.meta.env.VITE_GUEST_TOKEN
  const storeToken = localStorage.getItem(storeKey)

  if(storeToken) {
    config.headers['satoken-mall'] = storeToken
  }

  return config
})

http.interceptors.response.use(
  res => handleResponse(res),
  (error) => handleHttpError(error),
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

  if (data instanceof Blob) return response
  if (data.code === 200) return data
  return Promise.reject(data)
}

function handleHttpError(error: AxiosError<CR<null>>) {
  if (error.response) {
    const { data, status } = error.response
    const options = {
      400: () => toast.warning(data.message),
      401: () => handleUnauthorized(),
      403: () => toast.warning('权限不足'),
      500: () => toast.error('服务器异常'),
    }

    options[status as keyof typeof options]()
  }
  // else {
  //   toast.error('网络异常，请稍后再试')
  // }

  return Promise.reject(error)
}

export default http
