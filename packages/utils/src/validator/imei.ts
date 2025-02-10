export class IMEIValidator {

  public static isValid(imei: string) {
    const cleanImei = imei.replace(/[ -]/g, '')

    if (!/^\d{15}$/.test(cleanImei)) return false
    if (!this.validateLuhn(cleanImei)) return false

    return true
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
