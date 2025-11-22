import type { CR } from "@3un/shared"
import axios, { AxiosError, type AxiosResponse } from "axios"
import { toast } from 'vue-sonner'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000 * 60,
})

http.interceptors.request.use(config => {
  const authKey = import.meta.env.VITE_ACCESS_TOKEN
  const guestKey = import.meta.env.VITE_GUEST_TOKEN
  const authToken = localStorage.getItem(authKey)
  const guestToken = localStorage.getItem(guestKey)

  if (authToken) {
    config.headers.Authorization = authToken
  }

  if(guestToken) {
    config.headers["satoken-mall"] = guestToken
  }

  if(!config.headers["Accept-Language"]) {
    const locale = localStorage.getItem('locale')
    config.headers['Accept-Language'] = locale ?? 'zh'
  }

  return config
})

http.interceptors.response.use(
  (res) => handleResponse(res),
  (error) => handleHttpError(error)
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

  if(data.code === 200) return data
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

function handleUnauthorized() {
  toast.warning('身份认证过期, 请重新登录')

  localStorage.clear()
  sessionStorage.clear()
  location.reload()
}

export default http
