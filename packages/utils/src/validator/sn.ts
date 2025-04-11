import { SN_REG } from '../constants/regexs'

export class SNValidator {

  private static readonly excludePrefixs = [
    'MODEL', 'MACBOOK', 'CHINA', 'CALIF'
  ]

  public static isValid(sn: string) {
    if (![10, 11, 12].includes(sn.length)) return false
    let firstChar = sn[0]

    // 香港地区扫描的10位SN，会多出一个S
    // 需要去掉首字母S，长度变为10位
    if (sn.length === 11) {
      if (firstChar !== 'S') return false
      sn = sn.slice(1)
      firstChar = sn[0]
    }

    if (sn.length === 12 && !'CDFGHJ'.includes(firstChar)) return false
    if (sn.length === 10 && 'ABEIOSZ'.includes(firstChar)) return false
    if (!SN_REG.test(sn)) return false

    if (this.excludePrefixs.some(prefix => sn.startsWith(prefix))) return false
    return true
  }
}
