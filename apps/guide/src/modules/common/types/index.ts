export interface MenuItem {
  name: string
  value?: string
  children?: MenuItem[]
}

export interface SidebarItem {
  id: string
  label: string
  children?: SidebarItem[]
}

export interface ContentItem {
  value: string
  content: string
  images: { imageUrl: string; sort: number }[]
}

export interface PreviewState {
  visible: boolean
  currentImg: string
  images: string[]
  currentIndex: number
}