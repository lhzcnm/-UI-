export enum VERIFY_MSG {
  PHONE = 'login_NumberCannotEmpty',
  PHONE_FORMAT = 'login_PhoneFormat',

  TARGET = 'login_NotBeEmpt',
  TARGET_FORMAT = 'login_Format',

  EMAIL = 'login_EmailCannotEmpty',
  EMAIL_FORMAT = 'login_EmailFormat',

  CODE = 'login_CodeCannotEmpty',
  CODE_FORMAT = 'login_CodeFormat',

  USERNAME = 'login_UsernameCannotEmpty',
  USERNAME_LENGTH = 'login_UsernameLength',
  USERNAME_FORMAT = 'login_UsernameFormat',

  PASSWORD = 'login_PasswordCannotEmpty',
  PASSWORD_LESS = 'login_PasswordLeast',
  PASSWORD_LENGTH = 'login_PasswordLength',
  PASSWORD_FORMAT = 'login_PasswordFormat',
  PASSWORD_CONFIRM = 'login_PasswordsMatch',
}
