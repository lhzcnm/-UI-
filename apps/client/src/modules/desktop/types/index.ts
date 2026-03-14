// Sidebar
export interface SidebarMenu {
  label: string
  path: string
  icon: string
  type: 'basic' | 'extra'
  hide?: boolean
}
