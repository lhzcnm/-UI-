export interface MenuItem {
  label: string,
  icon: string,
  route: string,
}

export interface ToolItem {
  label: string,
  icon: string,
  command: () => void,
}
