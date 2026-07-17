import { getIllustrateImages } from "@/api/illustrate"
import { zIllustrateForm, type IllustrateImageItem, type IllustrateItem, type IllustrateSubmitForm } from "@/inters/illustrate"

async function urlToImageFile(
  url: string,
  filename: string
) : Promise<File> {
  const res = await fetch(url)
  const blob = await res.blob()

  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer.slice(0, 12))

  let mime = ''

  // png
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47
  ) {
    mime = 'image/png'
  }
  // jpeg
  else if (
    bytes[0] === 0xFF &&
    bytes[1] === 0xD8 &&
    bytes[2] === 0xFF
  ) {
    mime = 'image/jpeg'
  }
  // gif
  else if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46
  ) {
    mime = 'image/gif'
  }
  // webp
  else if (
    String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8,12)) === 'WEBP'
  ) {
    mime = 'image/webp'
  }
  else {
    throw new Error('不支持的文件类型')
  }

  return new File([blob], filename, {type: mime})
}

export async function getCodeImages(code: string) {
  return await getIllustrateImages({ serviceCode: code })
}

export async function buildIllustrateBody(
  illustrateItem: IllustrateItem,
  images: IllustrateImageItem[]
) {
  const submitBody: IllustrateSubmitForm = zIllustrateForm.parse({
    serviceCode: illustrateItem.serviceCode,
    description: illustrateItem.description ?? '',
    serviceDesc: illustrateItem.serviceDesc,
    images: []
  })

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    try {
      const file = await urlToImageFile(image.imageUrl, Date.now().toString(16))
      submitBody.images.push({
        sort: image.sort,
        file: file
      })
    } catch {
      continue
    }
  }

  return submitBody
}
