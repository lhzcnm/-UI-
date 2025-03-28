import type { InjectionKey } from "vue"

type ExpandedMenus = InjectionKey<Ref<string[]>>
export const EXPANDED_MENUS = Symbol('expandedMenus') as ExpandedMenus
