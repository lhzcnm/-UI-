import type { MenuItem, ToolItem } from '@/inters/basic/sidebar'
import { ua } from '@3un/utils'

export function getMenus(): MenuItem[] {
  return [
    { label: '首页', icon: 'tabler:home', route: '/auction/home' },
    ua.isDesktop && { label: '数据导出', icon: 'tabler:article', route: '/auction/preview' },
    { label: '历史记录', icon: 'tabler:history', route: '/auction/history' },
    { label: '设置', icon: 'tabler:settings', route: '/auction/setting' },
  ].filter((m) => !!m)
}

export function getTools(): ToolItem[] {
  return [
    { label: '查询验机平台', icon: 'lucide:tablet-smartphone', command: () => location.href = '/' }
  ]
}
