import { zCustomMessage, type BuiltInMessage, type BuiltInMsgUpdateParams, type CustomMessage, type CustomMessageCreateParams, type CustomMessageUpdateParams, type WechatMenu, type WechatMenuCreateParams, type WechatMenuUpdateParams } from "@/inters/wechat"
import http from "@/utils/http"

// Menu
type MenuListFn = () => Promise<WechatMenu[]>
export const getWechatMenu: MenuListFn = async () => {
  return (await http.get('/wx/menu')).data
}

type MenuCreateFn = (params: WechatMenuCreateParams) => Promise<void>
export const createWechatMenu: MenuCreateFn = async (params) => {
  return (await http.post('/wx/menu', params)).data
}

type MenuUpdateFn = (params: WechatMenuUpdateParams) => Promise<void>
export const updateWechatMenu: MenuUpdateFn = async (params) => {
  return (await http.put(`/wx/menu/${params.id}`, params)).data
}

type MenuDeleteFn = (id: number) => Promise<void>
export const deleteWechatMenu: MenuDeleteFn = async (id) => {
  await http.delete(`/wx/menu/${id}`)
}

type MenuPushFn = () => Promise<void>
export const pushWechatMenu: MenuPushFn = async () => {
  await http.post('/wx/menu/push')
}

// Built-in Message
type BuiltInMsgListFn = () => Promise<BuiltInMessage[]>
export const getBuiltInMsgList: BuiltInMsgListFn = async () => {
  return (await http.get('/wx/message')).data
}

type BuiltInMsgUpdateFn = (params: BuiltInMsgUpdateParams) => Promise<void>
export const updateBuiltInMsg: BuiltInMsgUpdateFn = async (params) => {
  return (await http.put(`/wx/message/${params.id}`, params)).data
}

// Custom Message
type CustomMessageListFn = () => Promise<CustomMessage[]>
export const getCustomMessageList: CustomMessageListFn = async () => {
  const { data } = await http.get<CustomMessage[]>('/wx/message/custom')
  return data.map(item => zCustomMessage.parse(item))
}

type CustomMessageCreateFn = (params: CustomMessageCreateParams) => Promise<CustomMessage>
export const createCustomMessage: CustomMessageCreateFn = async (params) => {
  const { data } = await http.post('/wx/message/custom', params)
  return zCustomMessage.parse(data)
}

type CustomMessageUpdateFn = (params: CustomMessageUpdateParams) => Promise<number>
export const updateCustomMessage: CustomMessageUpdateFn = async (params) => {
  return (await http.put(`/wx/message/custom`, params)).data
}

type CustomMessageDeleteFn = (id: number) => Promise<void>
export const deleteCustomMessage: CustomMessageDeleteFn = async (id) => {
  await http.delete(`/wx/message/custom/${id}`)
}
