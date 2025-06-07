export interface SidebarMenu {
  label: string
  icon: string
  path: string
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
    label: '仪表盘',
    path: '/dashboard',
    icon: 'lucide:home',
    match: 'yibiaopan',
  },
  {
    label: '用户管理',
    path: '/users',
    icon: 'lucide:users',
    children: [
      { label: '会员', match: 'huiyuan', path: '/users/all' },
      { label: '管理员', match: 'guanliyuan', icon: 'lucide:smile', path: '/users/admin' },
      { label: '会员等级', match: 'huiyuandengji', icon: 'lucide:gem', path: '/users/level' },
      { label: '包月会员', match: 'baoyuehuiyuan', icon: 'lucide:crown', path: '/users/paid' },
    ],
  },
  {
    label: '服务管理',
    path: '/service',
    icon: 'lucide:package-2',
    children: [
      { label: '字段分割', match: 'zifuangengfen', icon: 'lucide:square-split-horizontal', path: '/service/fields' },
      { label: '解锁推荐', match: 'jiesuojianyi', icon: 'lucide:flame', path: '/service/unlock' },
      { label: '服务组', match: 'fuwuzu', icon: 'lucide:users', path: '/service/groups' },
      { label: '服务', match: 'fuwu', icon: 'lucide:package', path: '/service/items' },
    ],
  },
  {
    label: '订单管理',
    path: '/orders',
    icon: 'lucide:shopping-bag',
    children: [
      { label: '全部订单', match: 'quandingdan', path: '/orders' },
      { label: '订单验证', match: 'dingdanyanzheng', path: '/orders/verify', icon: 'lucide:check-circle', badge: 9 },
      { label: '等待处理', match: 'dengdaichuli', path: '/orders?q=wait', icon: 'lucide:clock', badge: 4 },
      { label: '正在处理', match: 'zhengzaichuli', path: '/orders?q=processing', icon: 'lucide:square-activity', badge: 203 },
    ],
  },
  {
    label: '充值管理',
    path: '/recharge',
    icon: 'lucide:credit-card',
    children: [
      { label: '会员充值', match: 'huiyuanchongzhi', path: '/recharge' },
      { label: '今日充值', match: 'jinritianchongzhi', icon: 'lucide:calendar-days', path: '/recharge?q=today' },
      { label: '管理员充值', match: 'guanliyuanchongzhi', icon: 'lucide:coins', path: '/recharge?q=admin' },
    ],
  },
  {
    label: '日志管理',
    path: '/logs',
    icon: 'lucide:hard-drive',
    children: [
      { label: '用户登录日志', match: 'yonghudengluri', path: '/logs?q=user' },
      { label: '管理员登录日志', match: 'guanliyuandengluri', icon: 'lucide:paw-print', path: '/logs?q=admin' },
    ],
  },
  {
    label: '微信管理',
    path: '/wechat',
    icon: 'ph:wechat-logo',
    children: [
      { label: '菜单栏', match: 'caidanlan', path: '/wechat/menu' },
      { label: '客服消息', match: 'kefuxiaoxi', icon: 'lucide:message-circle-more', path: '/wechat/message' },
    ],
  },
  {
    label: '工单管理',
    path: '/tickets',
    icon: 'lucide:messages-square',
    match: 'gongdanguanli',
    badge: 10,
  },
  {
    label: 'API 管理',
    path: '/upstream',
    icon: 'lucide:plug-zap',
    match: 'apiguanli',
  },
  {
    label: '拦截管理',
    path: '/intercept',
    icon: 'lucide:pocket',
    match: 'lanjieguanli',
  },
]

export const tools: SidebarMenu[] = [
  {
    label: 'Redis 管理',
    path: '/redis',
    icon: 'lucide:database-zap',
    match: 'redisguanli',
  },
  {
    label: '批量编辑订单',
    path: '/batch-edit-orders',
    icon: 'lucide:square-bottom-dashed-scissors',
    match: 'piliangbianjidingdan',
  },
  {
    label: '富文本编辑',
    path: '/editor',
    icon: 'lucide:remove-formatting',
    match: 'fuwenbenbianji',
  },
]
