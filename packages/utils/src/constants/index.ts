import type { IK, Theme } from '@3un/shared'
import { Ref } from 'vue'

export const THEME = Symbol('THEME') as IK<Ref<Theme>>

export * from './enums'
export * from './regexs'
