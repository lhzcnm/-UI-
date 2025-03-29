import type { ServiceApi } from './types'
import http from '@/utils/http'

export * from './types'

export const serviceApi: ServiceApi = {
  convertModel: data => ({
    apiId: data.apiId,
    apiName: data.apiName,
    categoryId: data.categoryId,
    disablePackage: data.disablePackage,
    duplicateImeiNotAllowed: data.duplicateImeiNotAllowed,
    externalNetworkId: data.externalNetworkId,
    imeiFieldType: data.imeiFieldType,
    mustRead: data.mustRead,
    mustReadLocal: data.mustReadLocal,
    packageId: data.packageId,
    packageOrderBy: data.packageOrderBy,
    packagePrice: data.packagePrice,
    packageTitle: data.packageTitle,
    packageTitleLocal: data.packageTitleLocal,
    pushMsg: data.pushMsg,
    timeTaken: data.timeTaken,
    timeTakenLocal: data.timeTakenLocal,
    testimonials: data.testimonials,
    isNew: data.isNew,
    isHot: data.isHot,
    isUnlock: data.isUnlock,
  }),
  convertGroupModel: data => ({
    category: data.category,
    categoryId: data.categoryId,
    categoryLocal: data.categoryLocal,
    disableCategory: data.disableCategory,
    orderBy: data.orderBy,
  }),

  items: () => http.get('service'),
  createService: data => http.post('service', data),
  updateService: data => http.put('service', data),
  deleteService: id => http.delete(`service/${id}`),
  cleanPrice: id => http.delete(`service/clean/${id}`),

  syncList: (id) => http.get(`api/list/${id}`),
  serviceSync: data => http.put('api/service/edit', data),

  groups: () => http.get('service/group'),
  createGroup: data => http.post('service/group', data),
  updateGroup: data => http.put('service/group', data),
  deleteGroup: id => http.delete(`service/group/${id}`),

  fields: params => http.get('services/field', { params }),
  createField: data => http.post('services/field', data),
  updateField: data => http.put('services/field', data),
  deleteField: data => http.delete('services/field', { data }),
}
