import { SN_REG } from '../constants/regexs'

export class SNValidator {

  private static readonly excludePrefixs = [
    'MODEL', 'MACBOOK', 'CHINA', 'CALIF'
  ]

  public static isValid(sn: string) {
    if (![10, 12].includes(sn.length)) return false

    const firstChar = sn[0]
    if (sn.length === 12 && !'CDFGHJ'.includes(firstChar)) return false
    if (sn.length === 10 && 'ABEIOSZ'.includes(firstChar)) return false
    if (!SN_REG.test(sn)) return false

    if (this.excludePrefixs.some(prefix => sn.startsWith(prefix))) return false
    return true
  }
}
