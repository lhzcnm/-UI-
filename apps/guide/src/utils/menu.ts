export interface MenuItem {
  name: string
  value?: string
  children?: MenuItem[]
}

export const menus: MenuItem[] = [
  { name: '首页', value: 'home' },
  {
    name: '订单查询',
    children: [
      { name: '服务选择', value: 'serviceSelection' },
      { name: '导入按钮', value: 'serviceImport' },
      { name: '提交按钮', value: 'serviceSubmit' },
      { name: '导出按钮', value: 'serviceExport' },
      { name: '清空按钮', value: 'serviceClear' },
      { name: '重置按钮', value: 'serviceReset' },
      { name: '推送结果', value: 'servicePush' },
      { name: '线程设置', value: 'serviceThread' },
      { name: '字段筛选', value: 'serviceFilter' },
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
      { name: '开启验证', value: 'orderEnableValidation'},
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
]

export const menusAdmin: MenuItem[] = [
  { name: '首页', value: 'home' },
  { name: '顶部功能', value: 'top' },
  {
    name: '订单查询',
    children: [
      { name: '服务选择', value: 'service' },
      { name: '导入按钮', value: 'import' },
      { name: '提交按钮', value: 'submit' },
      { name: '导出按钮', value: 'export' },
      { name: '清空按钮', value: 'clear' },
      { name: '重置按钮', value: 'reset' },
      { name: '推送结果', value: 'push' },
      { name: '线程设置', value: 'thread' },
      { name: '查询结果', value: 'result' },
      { name: '字段筛选', value: 'filter' },
      { name: '页面大小', value: 'pageSize' },
    ]
  },
  {
    name: '查询打印',
    children: [
      { name: '订单按钮', value: 'cancel' },
      { name: '订单退款', value: 'refund' }
    ]
  },
  
]
