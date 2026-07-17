import http from './http'

export async function getDocxInfo(body: GetDocxBody[]) {
  const { data } = await http.post<DocxInfo[]>('serviceSpec', body)
  return data
}

export enum QueryType {
  // 精准匹配
  Precise = 1,
  // 通过头部匹配
  Prefix = 2,
}

export interface GetDocxBody {
  serviceCode: string,
  queryType: QueryType,
}

export interface ImageItem {
  sort: number,
  imageUrl: string,
}

export interface DocxInfo {
  serviceCode: string,
  serviceDesc: string,
  images: ImageItem,
}
