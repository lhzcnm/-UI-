import type { AxiosError, AxiosResponse } from 'axios'
import type { CR } from '@3un/shared'

import { toast } from 'vue-sonner'
import axios from 'axios'

const key = import.meta.env.VITE_ACCESS_TOKEN
const token = localStorage.getItem(key)

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Authorization: token },
  timeout: 5000 * 60,
})

http.interceptors.request.use(config => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key)
  
  config.headers.Authorization = token

  if(!config.headers['Accept-Language'])
  {
    const locale = localStorage.getItem('locale')
    config.headers['Accept-Language'] = locale ?? 'zh'
  }

  return config
})

http.interceptors.response.use(
  res => handleResponse(res),
  (error) => handleHttpError(error),
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

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
  else {
    toast.error('网络异常，请稍后再试')
  }

  return Promise.reject(error)
}

async function handleUnauthorized() {
  toast.warning('身份认证过期，请重新登录')

  localStorage.clear()
  sessionStorage.clear()
  window.location.reload()
}

export default http
