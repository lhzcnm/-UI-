import type { ServiceDetail, ServiceHeader } from "@/api/services"
import type { IK } from "@3un/shared"

interface ContainerItem {
  width: number,
  height: number,
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  fontSize: number,
  styles: Record<string, string>,
}

export interface TemplateItem {
  key: string,
  label: string,
  x: number,
  y: number,
  wrap?: boolean,
  width?: number,
  height?: number,
  type?: "text" | "qrcode" | "barcode",
  size?: number,
}

export interface CustomSubmitStore {
  services: ServiceDetail[],
  serviceCols: ServiceHeader[],
  selectCols: string[],

  container: ContainerItem,
  templateItems: TemplateItem[],

  serviceId: number,
}

export const CUSTOM_SUBMIT_STORE: IK<CustomSubmitStore> = Symbol("custom-submit")

export function getDefaultHeaders(): ServiceHeader[] {
  return [
    {
      serviceId: 0,
      name: "imei",
      nameEn: "imei",
      width: 0,
      sortNum: 0,
    },
    {
      serviceId: 0,
      name: "二维码",
      nameEn: "Qrcode",
      width: 0,
      sortNum: 0,
    }
  ]
}
