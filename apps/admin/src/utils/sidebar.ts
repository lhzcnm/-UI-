export interface SidebarMenuChild {
  label: string
  path: string
  badge?: number
}
export interface SidebarMenu extends SidebarMenuChild {
  children?: SidebarMenuChild[]
  icon: string
}

export const menus: SidebarMenu[] = [
  {
    icon: 'lucide:home',
    label: '仪表盘',
    path: '/dashboard',
  },
  {
    icon: 'lucide:users',
    label: '用户管理',
    path: '/users',
    children: [
      { label: '会员', path: 'all' },
      { label: '管理员', path: 'admin' },
      { label: '会员等级', path: 'level' },
      { label: '包月会员', path: 'paid' },
    ],
  },
  {
    icon: 'lucide:package-2',
    label: '服务管理',
    path: '/service',
    children: [
      { label: '字段分割', path: 'fields' },
      { label: '解锁推荐', path: 'unlock' },
      { label: '服务组', path: 'groups' },
      { label: '服务', path: 'items' },
    ],
  },
  {
    icon: 'lucide:shopping-bag',
    label: '订单管理',
    path: '/orders',
    children: [
      { label: '全部', path: 'all' },
      { label: '订单验证', path: 'verify', badge: 9 },
      { label: '等待处理', path: 'pending', badge: 4 },
      { label: '正在处理', path: 'processing', badge: 203 },
    ],
  },
  {
    icon: 'lucide:credit-card',
    label: '充值管理',
    path: '/recharge',
    children: [
      { label: '会员充值', path: 'all' },
      { label: '今日充值', path: 'today' },
      { label: '管理员充值', path: 'admin' },
    ],
  },
  {
    icon: 'lucide:hard-drive',
    label: '日志管理',
    path: '/logs',
    children: [
      { label: '用户登录日志', path: 'user' },
      { label: '管理员登录日志', path: 'admin' },
    ],
  },
  {
    icon: 'ph:wechat-logo',
    label: '微信管理',
    path: '/wechart',
    children: [
      { label: '菜单栏', path: 'menu' },
      { label: '客服消息', path: 'message' },
    ],
  },
  {
    icon: 'lucide:messages-square',
    label: '工单管理',
    path: '/tickets',
    badge: 10,
  },
  {
    icon: 'lucide:plug-zap',
    label: 'API 管理',
    path: '/interface',
  },
  {
    icon: 'lucide:pocket',
    label: '拦截管理',
    path: '/intercept',
  },
]

export const tools = [
  {
    icon: 'lucide:database-zap',
    label: 'Redis 管理',
    path: '/redis',
  },
  {
    icon: 'lucide:square-bottom-dashed-scissors',
    label: '批量编辑订单',
    path: '/batch-edit-orders',
  },
  {
    icon: 'lucide:remove-formatting',
    label: '富文本编辑',
    path: '/rich-text-editor',
  },
]
