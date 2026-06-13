import type { getLocalParams, postLocalParams, putLocalParams } from '@/types/local'
import http from '@/utils/http'

export class localApi {
  static getLocal(data: getLocalParams) {
    return http.get(`/language/page`, { params: data })
  }

  static postLocal(params: postLocalParams) {
    return http.post(`/language/add`, params)
  }

  static putLocal(params: putLocalParams) {
    return http.put(`/language/update`, params)
  }

  static deletetLocal(ids: number[]) {
    return http.delete(`/language`, { data: ids })
  }
}