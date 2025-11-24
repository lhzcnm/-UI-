export interface ChooseImageOption {
  /**
   * 最多可以选择的图片数量
   * @default 9
   */
  count?: number

  /**
   * 图片类型
   */
  sizeType?: ChooseImageSizeType[]

  /**
   * 图片来源
   */
  sourceType?: ChooseImageSourceType[]

  success: (result: ChooseImageSuccess) => void
  fail?: (result: ChooseImageFail) => void
  complete?: (result: ChooseImageComplete) => void
  cancel?: (result: ChooseImageCancel) => void
  trigger?: (result: ChooseImageTrigger) => void
}

type ChooseImageSourceType = 'album' | 'camera'
type ChooseImageSizeType = 'original' | 'compressed'

interface ChooseImageSuccess {
  sourceType: ChooseImageSourceType
  errMsg: 'chooseImage:ok'
  localIds: string[]
}
interface ChooseImageFail {
  errMsg: 'chooseImage:fail'
}
interface ChooseImageComplete {
  errMsg: 'chooseImage:complete'
}
interface ChooseImageCancel {
  errMsg: 'chooseImage:cancel'
}
interface ChooseImageTrigger {
  errMsg: 'chooseImage:trigger'
}

export interface UploadImageOption {
  localId: string

  /**
   * 显示进度提示
   */
  isShowProgressTips?: number

  success: (result: UploadImageSuccess) => void
  fail?: (result: UploadImageFail) => void
  complete?: (result: UploadImageComplete) => void
  cancel?: (result: UploadImageCancel) => void
  trigger?: (result: UploadImageTrigger) => void
}

interface UploadImageSuccess {
  serverId: string
  errMsg: 'uploadImage:ok'
}
interface UploadImageFail {
  errMsg: 'uploadImage:fail'
}
interface UploadImageComplete {
  errMsg: 'uploadImage:complete'
}
interface UploadImageCancel {
  errMsg: 'uploadImage:cancel'
}
interface UploadImageTrigger {
  errMsg: 'uploadImage:trigger'
}

export interface ScanQRCodeOption {
  /**
   * 扫描类型
   */
  scanType?: ('qrCode' | 'barCode')[]

  /**
   * 是否需要结果
   * 
   * - 0：扫描结果由微信处理（默认）
   * - 1：直接返回扫描结果
   */
  needResult?: 0 | 1

  success: (result: ScanQRCodeSuccess) => void
  fail?: (result: ScanQRCodeFail) => void
  complete?: (result: ScanQRCodeComplete) => void
  cancel?: (result: ScanQRCodeCancel) => void
  trigger?: (result: ScanQRCodeTrigger) => void
}

interface ScanQRCodeSuccess {
  resultStr: string
  errMsg: 'scanQRCode:ok'
}
interface ScanQRCodeFail {
  errMsg: 'scanQRCode:fail'
}
interface ScanQRCodeComplete {
  errMsg: 'scanQRCode:complete'
}
interface ScanQRCodeCancel {
  errMsg: 'scanQRCode:cancel'
}
interface ScanQRCodeTrigger {
  errMsg: 'scanQRCode:trigger'
}

export interface GetLocalImgDataOption {
  localId: string

  success: (result: GetLocalImgDataSuccess) => void
  fail?: (result: GetLocalImgDataFail) => void
  complete?: (result: GetLocalImgDataComplete) => void
  cancel?: (result: GetLocalImgDataCancel) => void
  trigger?: (result: GetLocalImgDataTrigger) => void
}

interface GetLocalImgDataSuccess {
  localData: string
  // 实际返回没有 errMsg
  // errMsg: 'getLocalImgData:ok'
}
interface GetLocalImgDataFail {
  errMsg: 'getLocalImgData:fail'
}
interface GetLocalImgDataCancel {
  errMsg: 'getLocalImgData:cancel'
}
interface GetLocalImgDataComplete {
  errMsg: 'getLocalImgData:complete'
}
interface GetLocalImgDataTrigger {
  errMsg: 'getLocalImgData:trigger'
}
