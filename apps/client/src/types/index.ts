import type { LAYOUT_POSITION } from "./print"

export type TemplateType = "text" | "qrcode" | "barcode" | "custom" | "Function" | "device"
export type TemplateDirection = "portrait" | "landscape"
// export type LayoutMode = "free" | "center-all" | "left-all" | "right-all"

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
  // portrait - 纵向, landscape - 横向
  orientation?: TemplateDirection,
  layout?: LAYOUT_POSITION
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

export interface PrintHeader {
  key: string,
  name: string,
  nameEn: string,
  type: TemplateType,
}

export interface PaperDirectionOption {
  value: TemplateDirection,
  label: string,
}
