export interface SidebarMenu {
  label: string
  path: string
  icon: string
  badge?: number
  match?: string[] | string
  children?: SidebarMenuChild[]
}
export interface SidebarMenuChild {
  match?: string[] | string
  label: string
  path: string
  icon?: string
  badge?: number
}

export const menus: SidebarMenu[] = [
  {
    icon: 'lucide:home',
    label: '仪表盘',
    path: '/dashboard',
    match: 'yibiaopan',
  },
  {
    icon: 'lucide:users',
    label: '用户管理',
    path: '/users',
    children: [
      { label: '会员', match: 'huiyuan', path: 'all' },
      { label: '管理员', match: 'guanliyuan', icon: 'lucide:smile', path: 'admin' },
      { label: '会员等级', match: 'huiyuandengji', icon: 'lucide:gem', path: 'level' },
      { label: '包月会员', match: 'baoyuehuiyuan', icon: 'lucide:crown', path: 'paid' },
    ],
  },
  {
    icon: 'lucide:package-2',
    label: '服务管理',
    path: '/service',
    children: [
      { label: '字段分割', match: 'zifuangengfen', icon: 'lucide:square-split-horizontal', path: 'fields' },
      { label: '解锁推荐', match: 'jiesuojianyi', icon: 'lucide:flame', path: 'unlock' },
      { label: '服务组', match: 'fuwuzu', icon: 'lucide:users', path: 'groups' },
      { label: '服务', match: 'fuwu', icon: 'lucide:package', path: 'items' },
    ],
  },
  {
    icon: 'lucide:shopping-bag',
    label: '订单管理',
    path: '/orders',
    children: [
      { label: '全部订单', match: 'quandingdan', path: 'all' },
      { label: '订单验证', match: 'dingdanyanzheng', path: 'verify', icon: 'lucide:check-circle', badge: 9 },
      { label: '等待处理', match: 'dengdaichuli', path: 'pending', icon: 'lucide:clock', badge: 4 },
      { label: '正在处理', match: 'zhengzaichuli', path: 'processing', icon: 'lucide:square-activity', badge: 203 },
    ],
  },
  {
    icon: 'lucide:credit-card',
    label: '充值管理',
    path: '/recharge',
    children: [
      { label: '会员充值', match: 'huiyuanchongzhi', path: 'all' },
      { label: '今日充值', match: 'jinritianchongzhi', icon: 'lucide:calendar-days', path: 'today' },
      { label: '管理员充值', match: 'guanliyuanchongzhi', icon: 'lucide:coins', path: 'admin' },
    ],
  },
  {
    icon: 'lucide:hard-drive',
    label: '日志管理',
    path: '/logs',
    children: [
      { label: '用户登录日志', match: 'yonghudengluri', path: 'user' },
      { label: '管理员登录日志', match: 'guanliyuandengluri', icon: 'lucide:paw-print', path: 'admin' },
    ],
  },
  {
    icon: 'ph:wechat-logo',
    label: '微信管理',
    path: '/wechart',
    children: [
      { label: '菜单栏', match: 'caidanlan', path: 'menu' },
      { label: '客服消息', match: 'kefuxiaoxi', icon: 'lucide:message-circle-more', path: 'message' },
    ],
  },
  {
    icon: 'lucide:messages-square',
    label: '工单管理',
    path: '/tickets',
    match: 'gongdanguanli',
    badge: 10,
  },
  {
    icon: 'lucide:plug-zap',
    label: 'API 管理',
    path: '/interface',
    match: 'apiguanli',
  },
  {
    icon: 'lucide:pocket',
    label: '拦截管理',
    path: '/intercept',
    match: 'lanjieguanli',
  },
]

export const tools: SidebarMenu[] = [
  {
    icon: 'lucide:database-zap',
    label: 'Redis 管理',
    path: '/redis',
    match: 'redisguanli',
  },
  {
    icon: 'lucide:square-bottom-dashed-scissors',
    label: '批量编辑订单',
    path: '/batch-edit-orders',
    match: 'piliangbianjidingdan',
  },
  {
    icon: 'lucide:remove-formatting',
    label: '富文本编辑',
    path: '/rich-text-editor',
    match: 'fuwenbenbianji',
  },
]
