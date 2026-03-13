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

export const menusAdmin: MenuItem[] = [
  { name: '顶部功能', value: 'topFunctionAdmin' },
  {
    name: '用户管理 - 会员/管理员/包月会员',
    children: [
      { name: '筛选按钮', value: 'userFilterAdmin' },
      { name: '新增按钮', value: 'userCreateAdmin' },
      { name: '编辑按钮', value: 'userEditAdmin' },
      { name: '查看详情', value: 'userDetailAdmin' },
      { name: '积分设置', value: 'userPointsSettingAdmin' },
      { name: '查询类积分设置', value: 'queryPointsSettingAdmin' },
      { name: '解锁类积分设置', value: 'unlockPointsSettingAdmin' },
      { name: '服务设置', value: 'userServiceSettingAdmin' },
      { name: '订单历史', value: 'userOrderHistoryAdmin' },
      { name: '积分记录', value: 'userPointsHistoryAdmin' },
      { name: '充值记录', value: 'userRechargeHistoryAdmin' },
      { name: '登录日志', value: 'userLoginLogAdmin' },
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
      { name: '批量删除', value: 'fieldSplitDeleteAdmin' },
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
    children: [
      { name: '新增服务组', value: 'serviceGroupCreateAdmin' },
      { name: '编辑按钮', value: 'serviceGroupEditAdmin' },
      { name: '查看服务', value: 'serviceGroupViewAdmin' },
    ]
  },

  {
    name: '服务管理 - 服务',
    children: [
      { name: '新增按钮', value: 'serviceCreateAdmin' },
      { name: '编辑按钮', value: 'serviceEditAdmin' },
      { name: '其他功能', value: 'serviceOtherFunctionAdmin' },
    ]
  },

  {
    name: '服务管理 - 打印模版',
    value: 'printTemplateAdmin',
  },

  {
    name: '订单管理 - 全部订单/等待处理/正在处理',
    children: [
      { name: '筛选按钮', value: 'orderFilterAdmin' },
      { name: '清空按钮', value: 'orderClearAdmin' },
      { name: '编辑按钮', value: 'orderEditAdmin' },
      { name: '导出订单', value: 'orderExportAdmin' },
      { name: '复制IMEI', value: 'orderCopyImeiAdmin' },
      { name: '批量编辑', value: 'orderBatchEditAdmin' },
      { name: '推送通知', value: 'orderPushNoticeAdmin' },
      { name: '接受订单', value: 'orderAcceptAdmin' },
      { name: '重新提交', value: 'orderResubmitAdmin' },
      { name: '拒绝订单', value: 'orderRejectAdmin' },
    ]
  },

  {
    name: '订单管理 - 订单验证',
    children: [
      { name: '批量回复', value: 'orderBatchReplyAdmin' },
      { name: '批量退积分', value: 'orderBatchRefundPointsAdmin' }
    ]
  },

  {
    name: '充值管理 - 会员/管理员/今日充值',
    children: [
      { name: '筛选按钮', value: 'rechargeFilterAdmin' },
      { name: '手续费设置', value: 'rechargeFeeSettingAdmin' },
      { name: '编辑按钮', value: 'rechargeEditAdmin' }
    ]
  },

  {
    name: '充值管理 - 包月套餐',
    children: [
      { name: '添加套餐', value: 'packageCreateAdmin' },
      { name: '编辑套餐', value: 'packageEditAdmin' }
    ]
  },

  {
    name: '日志管理',
    value: 'logManageAdmin'
  },

  {
    name: '微信管理 - 菜单栏',
    children: [
      { name: '推送按钮', value: 'wechatMenuPushAdmin' },
      { name: '新增按钮', value: 'wechatMenuCreateAdmin' },
      { name: '编辑按钮', value: 'wechatMenuEditAdmin' },
    ]
  },

  {
    name: '微信管理 - 客服消息',
    children: [
      { name: '新增按钮', value: 'wechatServiceMsgCreateAdmin' },
      { name: '编辑按钮', value: 'wechatServiceMsgEditAdmin' },
      { name: '内置客服消息', value: 'wechatBuiltInServiceMsgAdmin' }
    ]
  },

  {
    name: '活动管理 - 活动列表',
    children: [
      { name: '筛选按钮', value: 'activityFilterAdmin' },
      { name: '新增活动', value: 'activityCreateAdmin' },
      { name: '编辑活动', value: 'activityEditAdmin' },
      { name: '活动规则', value: 'activityRuleAdmin' },
      { name: '查看描述', value: 'activityDescriptionAdmin' },
    ]
  },

  {
    name: '活动管理 - 活动充值',
    children: [
      { name: '筛选按钮', value: 'activityRechargeFilterAdmin' },
      { name: '生成积分卷', value: 'pointsCouponGenerateAdmin' }
    ]
  },

  {
    name: '积分卷管理',
    value: 'pointsCouponManageAdmin'
  },

  {
    name: '积分记录',
    value: 'pointsRecordAdmin'
  },

  {
    name: '工单管理',
    children: [
      { name: '筛选按钮', value: 'ticketFilterAdmin' },
      { name: '常见问题', value: 'ticketFaqAdmin' },
      { name: '工单列表', value: 'ticketListAdmin' },
    ]
  },

  {
    name: 'API管理',
    children: [
      { name: '新增API', value: 'apiCreateAdmin' },
      { name: '编辑API', value: 'apiEditAdmin' },
      { name: '同步按钮', value: 'apiSyncAdmin' },
    ]
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

  {
    name: '设置',
    children: [
      { name: '常规设置', value: 'settingGeneralAdmin' },
      { name: '公告设置', value: 'settingNoticeAdmin' },
      { name: '高级设置', value: 'settingAdvancedAdmin' },
    ]
  },
]
