export interface ContainerItem {
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
  // portrait - 纵向, landscape - 横向
  orientation?: "portrait" | "landscape",
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
  type: "text" | "qrcode" | "barcode",
  align?: "left" | "center" | "right",
  showField?: boolean,
  size?: number,
}

export interface PrintTemplateJson {
  serviceId?: number,

  paper: {
    width: number,
    height: number,
    padding: {
      top: number,
      right: number,
      bottom: number,
      left: number,
    },
    fontSize: number,
    orientation?: "portrait" | "landscape",
  },
  items: {
    key: string,
    label: string,
    label_local: string,
    x: number,
    y: number,
    wrap?: boolean,
    type: "text" | "qrcode" | "barcode",
    align?: "left" | "center" | "right",
    size?: number,
    showField?: boolean,
  }[],
}

export interface PrintHeader {
  key: string,
  name: string,
  nameEn: string,
  type: "text" | "qrcode" | "barcode",
}
