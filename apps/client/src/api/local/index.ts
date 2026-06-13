import http from '@/utils/http'


export class localApi {
  static getLocal(data: string) {
    return http.get(`/language`, {
      headers: {
        'Accept-Language': data
      }
    })
  }
}