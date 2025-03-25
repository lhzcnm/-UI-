import type { ForgotApi } from '../types'
import http from '@/utils/http'

const forgotApi: ForgotApi = {
  forgotPsw: (params) => http.put('auth/forgot-psw', params),
}

export default forgotApi
