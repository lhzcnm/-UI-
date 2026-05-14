import jsPDF from 'jspdf'
import qrcode from 'qrcode-generator'
import JsBarcode from 'jsbarcode'

import type { PageItem, PluginPdfRequest } from '@/types/print'
import { registerSimHei } from './font'
import { pxToMM } from '../common'

const DPI = 96

export async function generatePDF(params: PluginPdfRequest) {
  const { 
    paper,
    pages
   } = params
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: "mm",
    format: [paper.width, paper.height],
  })

  let maxWidth = paper.width

  if (paper.orientation === 'landscape') {
    maxWidth = paper.height
  }

  await registerSimHei(pdf)

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    drawTemplate(pdf, page.items, maxWidth)
    if (i < pages.length - 1) {
      pdf.addPage()
    }
  }

  return pdf.output("blob")
}

function drawTemplate(
  pdf: jsPDF,
  page: PageItem[],
  maxWidth: number
) {
  for (const item of page) {
    switch (item.type) {
      case "text":
      case "custom":
      case "device":
        drawText(pdf, item, maxWidth)
        break
      
      case "qrcode":
        drawQrcode(pdf, item)
        break
      
      case "barcode":
        drawBarcode(pdf, item)
        break
    }
  }
}

async function drawText(
  pdf: jsPDF,
  field: PageItem,
  maxWidth: number
) {
  if (field.value === "") return
  
  let text = field.value
  if (field.showField) {
    if (field.wrap) {
      text = field.label + "\n" + field.value
    } else {
      text = field.label + ": " + field.value
    }
  }

  const fontSize = field.size ?? 8
  pdf.setFontSize(fontSize)

  const lineHeight = field.size! * DPI / 72 * 1.5

  const finalLines: string[] = []

  for (const line of text!.split("\n")) {
    const splitLines = pdf.splitTextToSize(line, 9999)
    finalLines.push(...splitLines)
  }

  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i]

    const lineWidth = pdf.getTextWidth(line)

    let drawX = field.x

    switch (field.align) {
      case "center":
        drawX = (maxWidth - lineWidth) / 2
        break
      case "right":
        drawX = maxWidth - lineWidth
        break
    }

    const drawY = field.y + (i * lineHeight)

    if (field.flip) {
      pdf.setFillColor(0, 0, 0)

      pdf.rect(
        drawX,
        drawY,
        lineWidth,
        lineHeight,
        "F"
      )

      pdf.setTextColor(255, 255, 255)
    } else {
      pdf.setTextColor(0, 0, 0)
    }

    pdf.text(
      line,
      drawX,
      drawY,
      {
        baseline: "top"
      }
    )
  }
}

async function drawQrcode(
  pdf: jsPDF,
  field: PageItem,
) {
  if (!field.value || !field.size) return

  const qr = qrcode(
    0,
    "H"
  )

  const utf8Bytes = new TextEncoder().encode(field.value)

  qr.addData(utf8BytesToString(utf8Bytes), "Byte")
  qr.make()

  const moduleCount = qr.getModuleCount()

  const moduleSize = field.size / moduleCount

  pdf.setFillColor(0, 0, 0)

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        pdf.rect(
          field.x + col * moduleSize,
          field.y + row * moduleSize,
          moduleSize,
          moduleSize,
          "F"
        )
      }
    }
  }
}

async function drawBarcode(
  pdf: jsPDF,
  field: PageItem
) {

  if (!field.value || !field.size)
    return

  const barcodeData: any = {}

  JsBarcode(
    barcodeData,
    field.value,
    {
      format: "CODE128",
      displayValue: false,
      margin: 0,
    }
  )

  if (!barcodeData.encodings.length)
    return

  const encoding =
    barcodeData.encodings[0]

  const binary =
    encoding.data

  let moduleWidthMm = pxToMM(1)

  if (field.barcodeWidth) {
    moduleWidthMm = pxToMM(field.barcodeWidth)
  }

  const targetHeightMm = field.size

  const actualWidthMm =
    binary.length *
    moduleWidthMm

  let currentX =
    field.x

  pdf.setFillColor(0, 0, 0)

  for (let i = 0; i < binary.length; i++) {

    if (binary[i] === "1") {
      pdf.rect(
        currentX,
        field.y,
        moduleWidthMm,
        targetHeightMm,
        "F"
      )
    }

    currentX += moduleWidthMm
  }

  if (field.showField) {
    const fontSizePt = field.size * 0.5

    pdf.setFont(
      "simhei",
      "normal"
    )

    pdf.setFontSize(
      fontSizePt * 0.5
    )

    const textWidth =
      pdf.getTextWidth(
        field.value
      )

    const textX =
      field.x +
      (actualWidthMm - textWidth) / 2

    const textY =
      field.y +
      targetHeightMm +
      1.5

    pdf.text(
      field.value,
      textX,
      textY
    )
  }
}

function utf8BytesToString(bytes: Uint8Array) {
  let str = ""

  for (const b of bytes) {
    str += String.fromCharCode(b)
  }

  return str
}
