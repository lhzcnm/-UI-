export class SNDomestic {
  public static isValid(sn: string, snReg: RegExp) {
    if (!snReg.test(sn)) return false

    return true
  }
}
