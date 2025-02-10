export class SNValidator {

  public static isValid(sn: string) {
    if (![10, 12].includes(sn.length)) return false

    const firstChar = sn[0]
    if (sn.length === 12 && 'CDFGHJ'.includes(firstChar)) return false
    if (sn.length === 10 && !'ABEIOSZ'.includes(firstChar)) return false
    if (!/^(?=.*[A-Za-z])[0-9a-zA-Z]{10,12}$/.test(sn)) return false

    return true
  }
}
