import type { IPage } from '@3un/shared'

import type { IList } from '@/inters/common'
import { zOssItem, type OssItem, type OssUpdateParams, type OssUpload } from '@/inters/oss'
import http from '@/utils/http'

type GetOssDataListFn = (params: IPage) => Promise<IList<OssItem>>
export const getOssDataList: GetOssDataListFn = async (params) => {
  const { data } = await http.get<IList<OssItem>>('oss', { params })
  return { ...data, list: data.list.map(o => zOssItem.parse(o)) }
}

type UpdateOssDataFn = (body: OssUpload) => Promise<void>
export const UpdateOssData: UpdateOssDataFn = async (body) => {
  await http.post('oss/updateOss', body)
}

type UpdateServerOssUpdateFn = (body: OssUpdateParams) => Promise<void>
export const updateServerOss: UpdateServerOssUpdateFn = async (body) => {
  await http.post('oss/sendOssData', body)
}
