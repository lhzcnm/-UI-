export type TemplateType = "text" | "qrcode" | "barcode" | "custom" | "Function" | "device"
export type TemplateDirection = "portrait" | "landscape"

export interface LabelCreateForm {
  label: string
  value: string
}

export interface ContainerItem {
  width: number,
  height: number,
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  // fontSize: number,
  // styles: Record<string, string>,
  // portrait - 纵向, landscape - 横向
  orientation?: TemplateDirection,
}

export interface TemplateItem {
  key: string,
  label: string,
  label_local: string,
  x: number,
  y: number,
  wrap?: boolean,
  width?: number,
  height?: number,
  type: TemplateType,
  align?: "left" | "center" | "right",
  showField?: boolean,
  size?: number,
  barcodeWidth?: number,
  flip?: boolean,
}

export interface PrintTemplateJson {
  serviceId?: number,
  isDevice?: boolean,

  paper: {
    width: number,
    height: number,
    padding: {
      top: number,
      right: number,
      bottom: number,
      left: number,
    },
    orientation?: TemplateDirection,
  },
  items: {
    key: string,
    label: string,
    label_local: string,
    x: number,
    y: number,
    wrap?: boolean,
    type: TemplateType,
    align?: "left" | "center" | "right",
    size?: number,
    showField?: boolean,
    barcodeWidth?: number,
  }[],

  qrcodeKeys: string[],
  customLabels: Record<string, LabelCreateForm>,
}

export interface PaperDirectionOption {
  value: TemplateDirection,
  label: string,
}

export interface PrintHeader {
  key: string,
  name: string,
  nameEn: string,
  type: TemplateType,
}

export interface HeaderTag {
  key: string,
  label: string,
  type: TemplateType,
}

export interface ServiceHeader {
  serviceId?: number
  name: string
  nameEn: string | null
  width?: number
  sortNum?: number
}

export interface FieldValue {
  [key: string]: {
    title: string,
    value: string
  }
}
