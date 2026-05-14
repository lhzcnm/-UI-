import { getLanuagestring } from "@/utils/constant"
import type { PrintTemplateJson, TemplateDirection, TemplateType } from "."

const iStore = useSystemStore()

export enum PRINT_TYPE {
  TSPL = "tspl",
  PDF = "pdf"
}

export enum LAYOUT_POSITION {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
  FREE = 'free'
}

export const PRINT_TYPE_LIST = [
  { value: PRINT_TYPE.TSPL, label: "print.type.tspl" },
  { value: PRINT_TYPE.PDF, label: "print.type.pdf" },
]

export const LAYOUT_POSITION_LIST = [
  { value: LAYOUT_POSITION.FREE, label: getLanuagestring('align_free', iStore.lang) },
  { value: LAYOUT_POSITION.LEFT, label: getLanuagestring('align_left', iStore.lang) },
  { value: LAYOUT_POSITION.CENTER, label: getLanuagestring('align_center', iStore.lang) },
  { value: LAYOUT_POSITION.RIGHT, label: getLanuagestring('align_Right', iStore.lang) },
]

export interface PageItem {
  key: string,
  label: string,

  x: number,
  y: number,

  wrap?: boolean,
  type: TemplateType,

  value?: string,
  size? :number,
  align?: "left" | "center" | "right",

  showField: boolean,
  
  barcodeWidth?: number,
  flip?: boolean,
}

export interface PluginPdfRequest {
  serviceId: number,
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
  pages: {
    items: PageItem[],
  }[]
}

export interface DeviceServiceItem {
  serviceId: number,
  title: string,
}

export interface HeaderTag {
  key: string,
  label: string,
  type: TemplateType,
}

export interface TemplateResp {
  id: number,
  template: PrintTemplateJson,
  name: string,
}

export interface LabelCreateForm {
  label: string
  value: string
}

export const initForm: LabelCreateForm = {
  label: '',
  value: '',
}
