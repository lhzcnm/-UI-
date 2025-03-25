import { IMEI_REG } from '../constants/regexs'

export class IMEIValidator {

  public static isValid(imei: string) {
    const cleanImei = imei.replace(/[ -]/g, '')

    if (!/^\d{15}$/.test(cleanImei)) return false

    const prefix = cleanImei.slice(0, 2)
    if (!['35', '99', '86', '01'].includes(prefix)) return false
    if (!this.validateLuhn(cleanImei)) return false

    return true
  }

  public static findAllImeis(str: string) {
    if (!str.trim()) return []
    const imeis: string[] = []

    const matches = str.match(IMEI_REG)
    if (!matches) return imeis

    for (const match of matches) {
      const cleanImei = match.replace(/[ -]/g, '')
      if (this.isValid(cleanImei)) {
        imeis.push(cleanImei)
      }
    }

    return [...new Set(imeis)]
  }

  private static validateLuhn(imei: string): boolean {
    const digits = imei.split('').map(Number)

    let sum = 0
    const length = digits.length
    const parity = length % 2

    for (let i = length - 2; i >= 0; i--) {
      let digit = digits[i]

      if (i % 2 === parity) {
        digit *= 2

        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
    }

    const checkDigit = digits[length - 1]
    const calculatedCheckDigit = (10 - (sum % 10)) % 10

    return checkDigit === calculatedCheckDigit
  }
}
