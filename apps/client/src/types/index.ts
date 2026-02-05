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
  },
  items: {
    key: string,
    label: string,
    x: number,
    y: number,
    wrap?: boolean,
    type?: "text" | "qrcode" | "barcode",
    size?: number,
  }[],
}
