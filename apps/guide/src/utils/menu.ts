export interface MenuItem {
  name: string
  value?: string
  children?: MenuItem[]
}

export const menus: MenuItem[] = [
  {
    name: '首页', value: 'home'
  },
  {
    name: '订单查询',
    children: [
      { name: '服务选择', value: 'serviceSelection' },
      { name: '导入按钮', value: 'serviceImport' },
      { name: '提交按钮', value: 'serviceSubmit' },
      { name: '导出按钮', value: 'serviceExport' },
      { name: '推送结果', value: 'servicePush' },
      { name: '线程设置', value: 'serviceThread' },
      { name: '字段筛选', value: 'serviceFilter' },
      { name: '重置按钮', value: 'serviceReset' },
    ]
  },
  {
    name: '查询打印',
    value: 'queryPrint',
  },
  {
    name: '我的设备',
    value: 'myDevice',
  },
  {
    name: '我的订单',
    children: [
      { name: '筛选按钮', value: 'orderFillter' },
      { name: '导出按钮', value: 'orderExport' },
      { name: '打印结果', value: 'orderPrint' },
      { name: '复制IMEI', value: 'orderCopyImei' },
      { name: '生成图片', value: 'orderGenerateImage' },
      { name: '开启验证', value: 'orderEnableValidation' },
    ]
  },
  {
    name: '积分充值',
    children: [
      { name: '余额充值', value: 'recharge' },
      { name: '开通会员', value: 'member' },
      { name: '积分卷兑换', value: 'coupon' },
    ]
  },
  {
    name: '我的工单',
    value: 'workOrder',
  },
  {
    name: '会员中心',
    children: [
      { name: '账号操作', value: 'account' },
      { name: '微信操作', value: 'wechat' },
      { name: '手机号/邮箱操作', value: 'phone' },
      { name: '密码操作', value: 'password' },
      { name: '数据统计区', value: 'statistics' },
      { name: '查询助手', value: 'assistant' },
      { name: '联系客服/推荐码', value: 'customerService' },
    ]
  },
  {
    name: '竞价平台',
    children: [
      { name: '首页', value: 'auctionHome' },
      { name: '数据导出', value: 'actionExport' },
      { name: '设置', value: 'auctionSettings' },
    ]
  }
]

export const menusClient: MenuItem[] = [
  { name: '顶部功能', value: 'topFunction' },
  {
    name: '首页',
    value: 'homeClient',
  },
  {
    name: '订单',
    children: [
      { name: '筛选按钮', value: 'orderFilterClient' },
      { name: '导出按钮', value: 'orderExportClient' },
      { name: '开启验证/复制', value: 'orderEnableValidationClient' },
      { name: '生成图片', value: 'orderGenerateImageClient' },
    ]
  },
  {
    name: '提交订单',
    value: 'orderSubmitClient',
  },
  {
    name: '反馈',
    value: 'feedbackClient',
  },
  {
    name: '我的',
    children: [
      { name: '我的账户', value: 'accountClient' },
      { name: '修改手机号/邮箱', value: 'phoneClient' },
      { name: '修改账号/密码', value: 'passwordClient' },
    ]
  },
]

export const menusAdmin: MenuItem[] = [
  { name: '顶部功能', value: 'topFunctionAdmin' },
  {
    name: '用户管理 - 会员/管理员/包月会员',
    children: [
      { name: '筛选按钮', value: 'userFilterAdmin' },
      { name: '新增按钮', value: 'userCreateAdmin' },
      { name: '编辑按钮', value: 'userEditAdmin' },
      { name: '其他功能', value: 'userOtherFunctionAdmin' }
    ]
  },

  {
    name: '用户管理 - 会员等级',
    children: [
      { name: '新增等级', value: 'memberLevelCreateAdmin' },
      { name: '编辑按钮', value: 'memberLevelEditAdmin' },
      { name: '服务价格', value: 'memberServicePriceAdmin' },
    ]
  },

  {
    name: '服务管理 - 字段分割',
    children: [
      { name: '新增按钮', value: 'fieldSplitCreateAdmin' },
      { name: '编辑按钮', value: 'fieldSplitEditAdmin' },
    ]
  },

  {
    name: '服务管理 - 解锁推荐',
    children: [
      { name: '新增按钮', value: 'unlockRecommendCreateAdmin' },
      { name: '编辑按钮', value: 'unlockRecommendEditAdmin' },
      { name: '转换码编辑', value: 'unlockConvertCodeEditAdmin' },
    ]
  },

  {
    name: '服务管理 - 服务组',
    value: 'serviceGroupAdmin',
  },

  {
    name: '服务管理 - 服务',
    value: 'serviceAdmin',
  },

  {
    name: '服务管理 - 打印模版',
    value: 'printTemplateAdmin',
  },

  {
    name: '订单管理 - 全部订单/等待处理/正在处理',
    children: [
      { name: '筛选按钮', value: 'orderFilterAdmin' },
      { name: '清理订单', value: 'orderClearAdmin' },
      { name: '编辑按钮', value: 'orderEditAdmin' },
      { name: '导出订单', value: 'orderExportAdmin' },
      { name: '复制IMEI', value: 'orderCopyImeiAdmin' },
      { name: '批量编辑', value: 'orderBatchEditAdmin' },
    ]
  },

  {
    name: '订单管理 - 订单验证',
    value: 'orderVerifyAdmin',
  },

  {
    name: '充值管理 - 会员/管理员/今日充值',
    children: [
      { name: '手续费设置', value: 'rechargeFilterAdmin' },
    ]
  },
  {
    name: '微信管理 - 菜单栏',
    value: 'wechatMenuAdmin',
  },

  {
    name: '微信管理 - 客服消息',
    value: 'wechatMessageAdmin',
  },

  {
    name: '活动管理 - 活动列表',
    children: [
      { name: '活动', value: 'activityAdmin' },
      { name: '活动规则', value: 'activityRuleAdmin' },
    ]
  },

  {
    name: '活动管理 - 活动充值',
    value: 'activityRechargeAdmin',
  },

  {
    name: '积分卷管理',
    value: 'pointsCouponManageAdmin'
  },

  {
    name: '工单管理',
    value: 'workOrderAdmin'
  },

  {
    name: 'API管理',
    value: 'apiAdmin'
  },

  {
    name: '拦截管理',
    value: 'interceptManageAdmin'
  },

  {
    name: '批量编辑订单',
    value: 'toolBatchEditOrderAdmin'
  },

  {
    name: '富文本编辑',
    value: 'toolRichTextEditorAdmin'
  },
]
