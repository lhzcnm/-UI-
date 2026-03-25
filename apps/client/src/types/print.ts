export interface PageItem {
  key: string,
  label: string,

  x: number,
  y: number,

  wrap?: boolean,
  type?: "text" | "qrcode" | "barcode",

  value?: string,
  size? :number,
  align?: "left" | "center" | "right",

  showField: boolean,
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
    fontSize: number,
    orientation?: "portrait" | "landscape",
  },
  pages: {
    items: PageItem[],
  }[]
}
