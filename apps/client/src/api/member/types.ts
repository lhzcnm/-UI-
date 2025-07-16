import type { R } from '@3un/shared'

export interface MemberApi {
  memberList(): R<MemberItem[]>
  memberPkg(id: number): R<MemberPackage[]>
}

export interface MemberItem {
  id: number
  planId: number
  shopName: string
  price: number
  month: number
  createTime: string
}

export interface MemberPackage {
  id: number
  price: number | null
  freeCount: number | null
}
