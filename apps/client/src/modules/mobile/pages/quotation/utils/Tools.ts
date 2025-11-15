import * as html2image from 'html-to-image'

/**
 * WatermarkTool 工具类
 * 用于生成带水印的 DOM 截图图片并自动下载
 */
export class WatermarkTool {
  /**
   * 生成带水印的截图并下载
   * @param id DOM 元素的 id
   * @param watermarkText 水印文字（默认 '陆深三和'）
   * @param options 自定义配置（可选）
   */
  static async generateImage(
    id: string,
    watermarkText = '陆深三和',
    options?: {
      fontSize?: number
      opacity?: number
      rotate?: number
      stepX?: number
      stepY?: number
      fileName?: string
    }
  ) {
    try {
      const dom = document.getElementById(id)
      if (!dom) {
        console.warn(`[WatermarkTool] 元素 #${id} 未找到`)
        return
      }

      const blob = await html2image.toBlob(dom, {
        width: dom.scrollWidth,
        height: dom.scrollHeight,
        skipFonts: true,
        cacheBust: true,
        style: { backgroundColor: '#fff' },
      })

      if (!blob) {
        console.error('[WatermarkTool] 截图生成失败')
        return
      }

      const img = new Image()
      const blobUrl = URL.createObjectURL(blob)
      img.src = blobUrl

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)

        // === 可自定义参数 ===
        const fontSize = options?.fontSize ?? 64
        const opacity = options?.opacity ?? 0.15
        const rotate = options?.rotate ?? -20
        const stepX = options?.stepX ?? 300
        const stepY = options?.stepY ?? 300
        const fileName = options?.fileName ?? `报价单_${watermarkText}.png`

        // === 绘制水印 ===
        ctx.font = `${fontSize}px Microsoft YaHei`
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.textBaseline = 'middle'

        for (let x = 0; x < canvas.width + stepX; x += stepX) {
          for (let y = 0; y < canvas.height + stepY; y += stepY) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate((rotate * Math.PI) / 180)
            ctx.fillText(watermarkText, 0, 0)
            ctx.restore()
          }
        }

        // === 生成下载链接 ===
        canvas.toBlob((finalBlob) => {
          if (!finalBlob) return
          const finalUrl = URL.createObjectURL(finalBlob)
          const a = document.createElement('a')
          a.href = finalUrl
          a.download = fileName
          a.click()
          a.remove()
          URL.revokeObjectURL(finalUrl)
          URL.revokeObjectURL(blobUrl)
        })
      }
    } catch (error) {
      console.error('[WatermarkTool] 生成图片失败：', error)
    }
  }
}
