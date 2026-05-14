import type jsPDF from 'jspdf'

let cachedBase64: string | null = null

export async function registerSimHei(pdf: jsPDF) {
  if (!cachedBase64) {
    const res = await fetch("/fonts/simhei.ttf")
    const buffer = await res.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    cachedBase64 = btoa(binary)
  }

  const fontList = pdf.getFontList()
  
  if (!fontList["simhei"]) {
    pdf.addFileToVFS("simhei.ttf", cachedBase64)
    
    pdf.addFont("simhei.ttf", "simhei", "normal")
  }

  pdf.setFont("simhei")
}
