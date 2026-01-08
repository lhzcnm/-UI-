import type { IK } from "@3un/shared"
import type { PROFILE_TYPE, VALID_TYPE } from "../types"

export interface ProfileStore {
  visibleUnBind: boolean,

  unBindType: PROFILE_TYPE | undefined,
  validType: VALID_TYPE,
  code: string,
  isGetCode: boolean,
  loading: boolean,
}

export const PROFILE_STORE: IK<ProfileStore> = Symbol("profile")
