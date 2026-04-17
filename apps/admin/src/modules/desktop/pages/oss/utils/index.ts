import type { IList } from '@/inters/common'
import type { OssItem } from '@/inters/oss'
import type { IK } from '@3un/shared'

export const OSS_STORE: IK<OssStore> = Symbol('oss-store')

export interface OssStore {
  visibleUpdate: boolean,

  ossData: IList<OssItem>,

  page: number,
  pageSize: number,
  refresh: boolean,
}