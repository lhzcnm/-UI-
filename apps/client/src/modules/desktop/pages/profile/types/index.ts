export type Action = 'account' | 'wechat' | 'phone' | 'email' | 'password'

export enum PROFILE_TYPE {
  WECHAT = 1,
  PHONE  = 2,
  EMAIL  = 3,
}

export const PROFILE_TYPE_MAP = {
  [PROFILE_TYPE.WECHAT]: { value: PROFILE_TYPE.WECHAT, label: "微信" },
  [PROFILE_TYPE.PHONE]: { value: PROFILE_TYPE.PHONE, label: "手机号" },
  [PROFILE_TYPE.EMAIL]: { value: PROFILE_TYPE.EMAIL, label: "邮箱" },
}

export enum VALID_TYPE {
  PHONE = 1,
  EMAIL = 2,
}

export const VALID_TYPE_LIST = [
  { value: VALID_TYPE.PHONE, label: "手机号" },
  { value: VALID_TYPE.EMAIL, label: "邮箱" },
]

export const VALID_TYPE_MAP = {
  [VALID_TYPE.PHONE]: "手机号",
  [VALID_TYPE.EMAIL]: "邮箱",
}
