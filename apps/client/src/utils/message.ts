export enum VERIFY_MSG {
  PHONE = '手机号不能为空',
  PHONE_FORMAT = '手机号格式不正确',

  TARGET = '邮箱/手机号不能为空',
  TARGET_FORMAT = '邮箱/手机号格式不正确',

  EMAIL = '邮箱不能为空',
  EMAIL_FORMAT = '邮箱格式不正确',

  CODE = '验证码不能为空',
  CODE_FORMAT = '验证码格式不正确',

  USERNAME = '账号不能为空',
  USERNAME_LENGTH = '账号长度在 6-16 位之间',
  USERNAME_FORMAT = '账号格式不正确',

  PASSWORD = '密码不能为空',
  PASSWORD_LESS = '密码至少含有一位数字、字母',
  PASSWORD_LENGTH = '密码长度在 8-18 位之间',
  PASSWORD_FORMAT = '密码格式不正确',
  PASSWORD_CONFIRM = '两次密码不一致',
}
