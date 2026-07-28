import axios, { AxiosResponse } from 'axios'

// export interface

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 60,
})

http.interceptors.response.use(
  response => handleResponse(response)
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

  return data
}

export default http
