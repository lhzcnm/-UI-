export enum VERIFY_MSG {
  USER_ID   = '用户ID必须是数字',
  USERNAME  = '用户名必须是 6-16 位的数字、字母、下划线',
  WEIXIN_OPENID = '微信 OpenId 必须是 28 位字符串',
  
  FMT_USERNAME = '用户名格式不正确',
  FMT_PASSWORD  = '密码格式不正确',
  FMT_PHONE = '手机号格式不正确',
  FMT_EMAIL = '邮箱格式不正确',

  FMT_IP = 'IP 格式不正确',
  REQ_IP = 'IP 不能为空',

  FMT_API_IP = 'API 白名单含有不正确的 IP',
  FMT_LOGIN_IP = '登录白名单含有不正确的 IP',

  REQ_USER_NAME = '用户名不能为空',
  REQ_PASSWORD = '用户密码不能为空',

  REQ_NICKNAME = '用户昵称不能为空',
  REQ_FIELD_NAME = '字段名称不能为空',
  REQ_SERVICE_ID = '请选择服务',
  REQ_SERVICE_NAME = '服务名称不能为空',
  REQ_OPERATOR = '触发关键字不能为空',

  REQ_ORIGN_CODE = '原始码不能为空',
  REQ_CONVERT_CODE = '转换码不能为空',

  REQ_CATEGORY = '服务组名称不能为空',
  REQ_CATEGORY_EN = '服务组英文名称不能为空',

  REQ_API_TITLE = 'API名称不能为空',
  REQ_SERVER_URL = 'API地址不能为空',
  REQ_API_KEY = 'API密钥不能为空',
  REQ_ACCOUNT_ID = '用户ID/账号不能为空',

  FMT_PRICE = '服务价格格式不正确',
  FMT_FREE_COUNT = '免费次数格式不正确',

  REQ_MENU_NAME = '菜单名称不能为空',
  REQ_MENU_TYPE = '请选择菜单类型',
  REQ_MENU_KEY = '菜单KEY/URL不能为空',

  REQ_MSG_KEYWORDS = '关键字不能为空',
  REQ_MSG_CONTENT = '消息内容不能为空',
}
