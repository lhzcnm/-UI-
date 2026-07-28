import { ref, computed } from 'vue'
import type { MenuItem, SidebarItem } from '../types'

export function useMenu(menus: MenuItem[]) {
  const activeId = ref('')
  const expanded = ref<Record<string, boolean>>({})
  const searchKeyword = ref('')

  function convertMenuToSidebar(menuList: MenuItem[]): SidebarItem[] {
    return menuList.map(item => ({
      id: item.value || item.name,
      label: item.name,
      children: item.children ? convertMenuToSidebar(item.children) : undefined
    }))
  }

  const sidebarItems = ref<SidebarItem[]>(convertMenuToSidebar(menus))

  const filteredItems = computed(() => {
    if (!searchKeyword.value.trim()) return sidebarItems.value
    const keyword = searchKeyword.value.trim().toLowerCase()
    return sidebarItems.value
      .map(item => {
        if (item.children) {
          if (item.label.toLowerCase().includes(keyword)) return item
          const children = item.children.filter(child =>
            child.label.toLowerCase().includes(keyword)
          )
          if (children.length) return { ...item, children }
          return null
        } else if (item.label.toLowerCase().includes(keyword)) {
          return item
        }
        return null
      })
      .filter(Boolean) as SidebarItem[]
  })

  function getMenuNameById(id: string): string {
    for (const menu of menus) {
      if (menu.value === id) return menu.name
      if (menu.children) {
        const child = menu.children.find(item => item.value === id)
        if (child) return child.name
      }
    }
    return id
  }

  function isParentActive(parentId: string): boolean {
    const parent = sidebarItems.value.find(item => item.id === parentId)
    if (!parent) return false
    if (activeId.value === parentId) return true
    if (parent.children) {
      return parent.children.some(child => child.id === activeId.value)
    }
    return false
  }

  function toggleExpand(id: string) {
    expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
  }

  function setActive(id: string) {
    if (activeId.value === id) return
    activeId.value = id
    for (const menu of menus) {
      if (menu.children) {
        const hasChild = menu.children.some(child => child.value === id)
        if (hasChild && !expanded.value[menu.value || menu.name]) {
          expanded.value = { ...expanded.value, [menu.value || menu.name]: true }
          break
        }
      }
    }
  }

  return {
    activeId,
    expanded,
    searchKeyword,
    sidebarItems,
    filteredItems,
    getMenuNameById,
    isParentActive,
    toggleExpand,
    setActive
  }
}