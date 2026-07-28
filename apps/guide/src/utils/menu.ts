export interface MenuItem {
  name: string
  value?: string
  children?: MenuItem[]
}

export const menusClientDesktop: MenuItem[] = [
  {
    name: '快速上手', value: 'desktopclienthome'
  },
  {
    name: '核心功能操作',
    children: [
      { name: '首页快捷功能', value: 'desktopclientquickhome' },
      { name: '订单查询', value: 'desktopclientorderquery' },
      { name: '查询打印', value: 'desktopclientqueryprint' },
      { name: '我的设备', value: 'desktopclientdevices' },
      { name: '我的订单', value: 'desktopclientmyorder' },
    ]
  },
  {
    name: '账户与会员',
    children: [
      { name: '余额充值', value: 'desktopclientrecharge' },
      { name: '开通会员', value: 'desktopclientvip' },
      { name: '积分券兑换', value: 'desktopclientredeem' },
      { name: '导出消费记录', value: 'desktopclientpurchases' },
    ]
  },
  {
    name: '问题反馈（我的工单）',
    value: 'desktopclientTicket',
  },
  {
    name: '会员中心',
    children: [
      { name: '账户与密码管理', value: 'desktopclientAccount' },
      { name: '数据统计', value: 'desktopclientstats' },
    ]
  },
  {
    name: '常见问题',
    value: 'desktopclientFAQ',
  },


]

export const menusClientMobile: MenuItem[] = [
  { name: '顶部功能', value: 'phoneclientHeader' },
  {
    name: '首页',
    value: 'phoneclientHome',
  },
  {
    name: '订单',
    children: [
      { name: '筛选功能', value: 'phoneclientOrderfilter' },
      { name: '导出功能', value: 'phoneclientOrderexport' },
      { name: '开启验证功能', value: 'phoneclientOrderverify' },
      { name: '复制功能', value: 'phoneclientOrdercopy' },
      { name: '生成图片', value: 'phoneclientOrderimages' },
    ]
  },
  {
    name: '提交订单',
    value: 'phoneclientsubmit',
  },
  {
    name: '反馈',
    value: 'phoneclientfeedback',
  },
  {
    name: '我的',
    children: [
      { name: '我的账户/账单/充值', value: 'phoneclientprofileaccount' },
      { name: 'API管理', value: 'phoneclientprofileAPI' },
      { name: '修改信息', value: 'phoneclientprofileupdate' },
    ]
  },
  {
    name: '公众号关键字',
    value: 'phoneclientpublic'
  },
  {
    name: '使用注意事项',
    value: 'phoneclientTip'
  },
]

export const menusAdminDesktop: MenuItem[] = [
  { name: '顶部功能', value: 'desktopadminHeader' },
  {
    name: '用户管理 - 会员/管理员/包月会员',
    children: [
      { name: '筛选功能', value: 'desktopadminUserManagerfilter' },
      { name: '新增功能', value: 'desktopadminUserManageradd' },
      { name: '编辑功能', value: 'desktopadminUserManagerupdate' },
      { name: '其他功能', value: 'desktopadminUserManagerother' }
    ]
  },
  {
    name: '用户管理 - 会员等级',
    children: [
      { name: '新增等级', value: 'desktopadminUserleveladd' },
      { name: '编辑功能', value: 'desktopadminUserlevelupdate' },
      { name: '服务价格', value: 'desktopadminUserlevelprice' },
    ]
  },
  {
    name: '服务管理 - 字段分割',
    children: [
      { name: '新增功能', value: 'desktopadminserversplitadd' },
      { name: '编辑功能', value: 'desktopadminserversplitupdate' },
    ]
  },
  {
    name: '服务管理 - 解锁推荐',
    children: [
      { name: '新增功能', value: 'desktopadminserverunlockadd' },
      { name: '编辑功能', value: 'desktopadminserverunlockupdate' },
      // { name: '转换码编辑', value: 'unlockConvertCodeEditAdmin' },
    ]
  },
  {
    name: '服务管理 - 服务组',
    value: 'desktopadminservergroup',
  },
  {
    name: '服务管理 - 服务',
    value: 'desktopadminservers',
  },
  {
    name: '服务管理 - 打印模版',
    value: 'desktopadminserverprint',
  },
  {
    name: '订单管理 - 全部订单/等待处理/正在处理',
    children: [
      { name: '筛选功能', value: 'desktopadminorderFilter' },
      { name: '清理订单', value: 'desktopadminorderClear' },
      { name: '编辑功能', value: 'desktopadminorderEdit' },
      { name: '导出订单', value: 'desktopadminorderExport' },
      { name: '复制IMEI', value: 'desktopadminorderCopy' },
      { name: '批量编辑', value: 'desktopadminorderBatch' },
    ]
  },
  {
    name: '订单管理 - 订单验证',
    value: 'desktopadminorderVerify',
  },
  {
    name: '充值管理 - 会员/管理员/今日充值',
    children: [
      { name: '手续费设置', value: 'desktopadminRechange' },
    ]
  },
  {
    name: '微信管理 - 菜单栏',
    value: 'desktopadminwechatMenu',
  },
  {
    name: '微信管理 - 客服消息',
    value: 'desktopadminwechatMessage',
  },
  {
    name: '活动管理 - 活动列表',
    children: [
      { name: '活动', value: 'desktopadminactivitys' },
      { name: '活动规则', value: 'desktopadminactivityRule' },
    ]
  },
  {
    name: '活动管理 - 活动充值',
    value: 'desktopadminactivityRecharge',
  },
  {
    name: '积分卷管理',
    value: 'desktopadminactivityCoupon'
  },
  {
    name: '工单管理',
    value: 'desktopadminworkorder'
  },
  {
    name: 'API管理',
    value: 'desktopadminAPI'
  },
  {
    name: '拦截管理',
    value: 'desktopadminintercept'
  },
  {
    name: '批量编辑订单',
    value: 'desktopadmintoolBatch'
  },
  {
    name: '富文本编辑',
    value: 'desktopadmintoolRich'
  },
]

export const menusAdminMobile: MenuItem[] = [
  { name: '顶部功能', value: 'phoneadminHeader' },
  {
    name: '用户管理 - 会员/管理员/包月会员',
    children: [
      { name: '筛选功能', value: 'phoneadminUserManagerfilter' },
      { name: '新增功能', value: 'phoneadminUserManageradd' },
      { name: '编辑功能', value: 'phoneadminUserManageredit' },
      { name: '其他功能', value: 'phoneadminUserManagerother' }
    ]
  },
  {
    name: '用户管理 - 会员等级',
    children: [
      { name: '新增等级', value: 'phoneadminUserleveladd' },
      { name: '编辑功能', value: 'phoneadminUserlevelupdate' },
      { name: '服务价格', value: 'phoneadminUserlevelprice' },
    ]
  },
  {
    name: '服务管理 - 字段分割',
    children: [
      { name: '新增功能', value: 'phoneadminserversplitadd' },
      { name: '编辑功能', value: 'phoneadminserversplitupdate' },
    ]
  },
  {
    name: '服务管理 - 解锁推荐',
    children: [
      { name: '新增功能', value: 'phoneadminserverunlockadd' },
      { name: '编辑功能', value: 'phoneadminserverunlockupdate' },
    ]
  },
  {
    name: '服务管理 - 服务组',
    value: 'phoneadminservergroup',
  },
  {
    name: '服务管理 - 服务',
    value: 'phoneadminservers',
  },
  {
    name: '订单管理 - 全部订单/等待处理/正在处理',
    children: [
      { name: '筛选功能', value: 'phoneadminorderFilter' },
      { name: '清理订单', value: 'phoneadminorderClear' },
      { name: '编辑功能', value: 'phoneadminorderEdit' },
    ]
  },
  {
    name: '充值管理',
    children: [
      { name: '会员/管理员/今日充值', value: 'phoneadminRechanges' },
      { name: '包月套餐', value: 'phoneadminRechangePlan' },
    ]
  },
  {
    name: '微信管理 - 菜单栏',
    value: 'phoneadminwechatMenu',
  },
  {
    name: '微信管理 - 客服消息',
    value: 'phoneadminwechatMessage',
  },
  {
    name: '活动管理 - 活动列表',
    children: [
      { name: '活动', value: 'phoneadminactivitys' },
      { name: '活动规则', value: 'phoneadminactivityRule' },
    ]
  },
  {
    name: '工单管理',
    value: 'phoneadminworkorder'
  },
  {
    name: 'API管理',
    value: 'phoneadminAPI'
  },
  {
    name: '拦截管理',
    value: 'phoneadminintercept.introduction'
  },
]
