import { zBuiltInMsg, zCustomMsg, type BuiltInMessage, type BuiltInMsgUpdateParams, type CustomMsg, type CustomMsgCreateParams, type CustomMsgUpdateParams, type WechatMenu, type WechatMenuCreateParams, type WechatMenuUpdateParams } from "@/inters/wechat"
import http from "@/utils/http"

// Menu
type MenuListFn = () => Promise<WechatMenu[]>
export const getWechatMenu: MenuListFn = async () => {
  return (await http.get('/wx/menu')).data
}

type MenuCreateFn = (params: WechatMenuCreateParams) => Promise<WechatMenu>
export const createWechatMenu: MenuCreateFn = async (params) => {
  return (await http.post('/wx/menu', params)).data
}

type MenuUpdateFn = (params: WechatMenuUpdateParams) => Promise<void>
export const updateWechatMenu: MenuUpdateFn = async (params) => {
  return (await http.put('/wx/menu', params)).data
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
  const { data } = await http.get<BuiltInMessage[]>('/wx/message')
  return data.map(item => zBuiltInMsg.parse(item))
}

type BuiltInMsgUpdateFn = (params: BuiltInMsgUpdateParams) => Promise<void>
export const updateBuiltInMsg: BuiltInMsgUpdateFn = async (params) => {
  return (await http.put('/wx/message', params)).data
}

// Custom Message
type CustomMsgListFn = () => Promise<CustomMsg[]>
export const getCustomMsgList: CustomMsgListFn = async () => {
  const { data } = await http.get<CustomMsg[]>('/wx/message/custom')
  return data.map(item => zCustomMsg.parse(item))
}

type CustomMsgCreateFn = (params: CustomMsgCreateParams) => Promise<CustomMsg>
export const createCustomMsg: CustomMsgCreateFn = async (params) => {
  const { data } = await http.post('/wx/message/custom', params)
  return zCustomMsg.parse(data)
}

type CustomMsgUpdateFn = (params: CustomMsgUpdateParams) => Promise<number>
export const updateCustomMsg: CustomMsgUpdateFn = async (params) => {
  return (await http.put('/wx/message/custom', params)).data
}

type CustomMsgDeleteFn = (id: number) => Promise<void>
export const deleteCustomMsg: CustomMsgDeleteFn = async (id) => {
  await http.delete(`/wx/message/custom/${id}`)
}
