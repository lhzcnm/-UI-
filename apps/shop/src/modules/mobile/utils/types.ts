export type ShopType = 'all' | 'hot' | 'new'
export type DisplayMode = "flex" | "grid"

export interface ShopTypeItem {
  id: ShopType,
  name: string,
}
