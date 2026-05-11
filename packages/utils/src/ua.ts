type OS = 'Windows' | 'MacOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown'
type Browser = 'WeChat Browser' | 'Firefox' | 'Chrome' | 'Safari' | 'Edge' | 'Internet Explorer' | 'Unknown'

interface DeviceInfo {
  os: OS
  browser: Browser
  language: string
  isDesktop: boolean
  isMobile: boolean
  isWechat: boolean
  wechatVersion: string
}

class DeviceDetector {
  private userAgent: string
  private language: string

  public os: OS
  public browser: Browser
  public isDesktop: boolean
  public isMobile: boolean
  public isWechat: boolean
  public wechatVersion: string

  constructor() {
    this.userAgent = navigator.userAgent
    this.language = navigator.language || (navigator as any).userLanguage

    this.os = this.detectOS()
    this.browser = this.detectBrowser()
    this.isWechat = this.detectWechat()
    this.wechatVersion = this.detectWechatVersion()
    this.isMobile = this.detectMobile()
    this.isDesktop = this.detectDesktop()
  }

  public getDeviceInfo(): DeviceInfo {
    return {
      os: this.os,
      browser: this.browser,
      language: this.language,
      isDesktop: this.isDesktop,
      isMobile: this.isMobile,
      isWechat: this.isWechat,
      wechatVersion: this.wechatVersion
    }
  }

  private detectOS(): OS {
    const ua = this.userAgent.toLowerCase()
    if (/android/.test(ua)) return 'Android'
    if (/iphone|ipad|ipod/.test(ua)) return 'iOS'

    if (/windows/.test(ua)) return 'Windows'
    if (/mac os/.test(ua) && !/like mac os/.test(ua)) return 'MacOS'
    if (/linux/.test(ua) && !/android/.test(ua)) return 'Linux'

    return 'Unknown'
  }

  private detectBrowser(): Browser {
    const ua = this.userAgent.toLowerCase();
    if (this.isWechat) return 'WeChat Browser'
    if (/edg/.test(ua)) return 'Edge'
    if (/trident|msie/.test(ua)) return 'Internet Explorer'
    if (/firefox/.test(ua) && !/seamonkey/.test(ua)) return 'Firefox'
    if (/chrome/.test(ua) && !/chromium/.test(ua) && !/opr/.test(ua) && !/edg/.test(ua)) return 'Chrome'
    if (/safari/.test(ua) && !/chrome/.test(ua) && !/chromium/.test(ua)) return 'Safari'
  
    return 'Unknown'
  }

  private detectWechat(): boolean {
    return /micromessenger/i.test(this.userAgent)
  }

  private detectWechatVersion(): string {
    if (!this.isWechat) return 'N/A'
    const match = this.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
    return match ? match[1] : 'Unknown'
  }

  private detectMobile(): boolean {
    const mobileKeywords = [
      // Android 设备
      'android',

      // iPhone / iPod
      'iphone',
      'ipod',

      // Blackberry 老设备
      'blackberry',

      // Windows Phone
      'windows phone',

      // 大部分手机浏览器 UA 都会带 mobile
      // 用于识别普通手机客户端
      'mobile',

      // 部分新版鸿蒙设备（尤其微信 / 系统 WebView）
      // 可能没有 mobile，但会带 phone
      // 某些华为 HarmonyOS 3/4 设备会出现这种情况
      // 所以这里额外兼容 phone
      'phone',
      'harmony'
    ]

    return mobileKeywords.some(keyword =>
      this.userAgent.toLowerCase().includes(keyword)
    )
  }

  private detectDesktop(): boolean {
    return !this.isMobile
  }
}

export const ua = new DeviceDetector()
