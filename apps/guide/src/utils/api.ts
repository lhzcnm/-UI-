import http from './http'

export class api {
  static async getGuide(serviceCode: string[]) {
    return http.get(`/service/spec`, {
      params: {
        serviceCode
      }
    })
  }
}