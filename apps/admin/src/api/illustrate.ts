import { zIllustrate, type IllustrateItem } from "@/inters/illustrate"
import http from "@/utils/http"

type IllustrateListFn = () => Promise<IllustrateItem[]>
export const getIllustrates: IllustrateListFn = async () => {
  const { data } = await http.get<IllustrateItem[]>('service/SpecList')
  return data.map(item => zIllustrate.parse(item))
}

type IllustrateUpdateFn = (body: IllustrateItem) => Promise<void>
export const updateIllustrate: IllustrateUpdateFn = async (body) => {
  await http.post('service/addsSpec', body)
}

type IllustrateUploadImgFn = (body: FormData) => Promise<string>
export const illustrateUploadImg: IllustrateUploadImgFn = async (body) => {
  const { data } = await http.post('service/upload/images', body)
  return data
}
