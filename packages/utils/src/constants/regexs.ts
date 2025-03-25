// Captcha must be exactly 6 digits.
export const CAPTCHA_REG = /^\d{6}$/

// Username must be between 2 and 12 characters, and can contain Chinese characters, letters, and numbers.
export const USERNAME_REG = /^[\u4E00-\u9FA5a-z0-9]{2,12}$/i

// User password must be between 8 and 18 characters, contain at least one letter, one number, supports special characters.
export const PASSWORD_REG = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-=[\]{}|;:,.<>?]{8,18}$/

// Email must match the standard email format.
export const EMAIL_REG = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

// Phone number must match the standard Chinese mobile phone number format.
export const PHONE_REG = /^13\d|14[014-9]|15[0-35-9]|16[2567]|17[0-8]|18\d|19[0-35-9]\d{8}$/

// IMEI or SN
export const IMEI_AND_SN_REG = /(\d{2} *\d{6} *\d{6} *\d)|((?!\d)(?=.*[A-Za-z])[A-Za-z0-9]{12})|((?!\d)(?=.*[A-Za-z])[A-Za-z0-9]{10})/g

// IMEI
export const IMEI_REG = /\d{2} *\d{6} *\d{6} *\d/

// SN
export const SN_REG = /((?!\d)(?=.*[A-Za-z])[A-Za-z0-9]{12})|((?!\d)(?=.*[A-Za-z])[A-Za-z0-9]{10})/
