// Password must be between 8 and 18 characters, contain at least one lowercase letter, one uppercase letter, one number, and one special character.
export const passwordReg = /^(?:[a-z]+[A-Z]+|\d+[@$!%*#?.&]+|[A-Z]+[@$!%*#?.&]+)[A-Z\d@$!%*#?.&]{7,17}$/i

// Captcha must be exactly 6 digits.
export const captchaReg = /^\d{6}$/

// Email must match the standard email format.
export const emailReg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

// Phone number must match the standard Chinese mobile phone number format.
export const phoneReg = /^13\d|14[014-9]|15[0-35-9]|16[2567]|17[0-8]|18\d|19[0-35-9]\d{8}$/

// Username must be between 2 and 12 characters, and can contain Chinese characters, letters, and numbers.
export const userNameReg = /^[\u4E00-\u9FA5a-z0-9]{2,12}$/i

// IMEI or SN
export const imeiAndSnReg = /(\d{2} *\d{6} *\d{6} *\d)|((?=.*[A-Za-z])(?=.*\d)[0-9a-zA-Z]{10,12})/g
