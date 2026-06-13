export enum MODULE_ENUM {
  /** 顶部工具栏 */
  TOP_TOOLBAR = 1,
  /** 侧边栏 */
  SIDEBAR = 2,
  /** 登录页面 */
  LOGIN_PAGE = 3,
  /** 首页 */
  HOME_PAGE = 4,
  /** 订单提交 */
  ORDER_SUBMIT = 5,
  /** 查询打印 */
  QUERY_PRINT = 6,
  /** 我的设备 */
  MY_DEVICE = 7,
  /** 我的订单 */
  MY_ORDER = 8,
  /** 积分充值 */
  POINT_RECHARGE = 9,
  /** 消费记录 */
  CONSUME_RECORD = 10,
  /** 我的工单 */
  MY_WORK_ORDER = 11,
  /** 会员中心 */
  MEMBER_CENTER = 12
}

export const LOCAL_MODULE_ENUM = [
  { value: MODULE_ENUM.TOP_TOOLBAR, label: '顶部工具栏' },
  { value: MODULE_ENUM.SIDEBAR, label: '侧边栏' },
  { value: MODULE_ENUM.LOGIN_PAGE, label: '登录页面' },
  { value: MODULE_ENUM.HOME_PAGE, label: '首页' },
  { value: MODULE_ENUM.ORDER_SUBMIT, label: '订单提交' },
  { value: MODULE_ENUM.QUERY_PRINT, label: '查询打印' },
  { value: MODULE_ENUM.MY_DEVICE, label: '我的设备' },
  { value: MODULE_ENUM.MY_ORDER, label: '我的订单' },
  { value: MODULE_ENUM.POINT_RECHARGE, label: '积分充值' },
  { value: MODULE_ENUM.CONSUME_RECORD, label: '消费记录' },
  { value: MODULE_ENUM.MY_WORK_ORDER, label: '我的工单' },
  { value: MODULE_ENUM.MEMBER_CENTER, label: '会员中心' }
]
