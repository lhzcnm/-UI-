import type { CR } from '@3un/shared'
import axios, { AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'

const baseUrl = import.meta.env.VITE_API_URL

const http = axios.create({
  baseURL: baseUrl,
  timeout: 5 * 50 * 1000,
})

http.interceptors.request.use(config => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key)

  if (token) {
    config.headers['Authorization'] = token
  }

  return config
})

http.interceptors.response.use(
  (res) => handleResponse(res),
  (error) => handleError(error),
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

  if (data instanceof Blob) return response
  if (response.status === 200) return data

  return Promise.reject(data)
}

function handleError(error: AxiosError<CR<null>>) {
  if (error.response) {
    const { data, status } = error.response
    const options = {
      401: () => handleUnauthorized(),
      400: () => toast.warning(data.message),
      500: () => toast.error('服务器异常'),
    }

    options[status as keyof typeof options]()
  }

  return Promise.reject(error)
}

function handleUnauthorized() {
  toast.warning('身份认证过期, 请重新登录')

  localStorage.clear()
  sessionStorage.clear()
  window.location.reload()
}

export default http
