import type { R } from '@3un/shared'

export interface SliderCaptchaProps {
  verify: (params: CaptchaCheckParams) => R<string>
  refresh: () => R<Captcha>
}

export interface SliderCaptchaEmits {
  (e: 'verified', id: string): void
}

export interface TrackList {
  type: 'down' | 'move' | 'up'
  x: number
  y: number
  t: number
}
export interface Captcha {
  id: string
  captcha: {
    data: null
    type: 'SLIDER'
    backgroundImage: string
    backgroundImageHeight: number
    backgroundImageTag: string
    backgroundImageWidth: number

    templateImage: string
    templateImageHeight: number
    templateImageTag: 'default'
    templateImageWidth: number
  }
}
export interface CaptchaCheckParams {
  id: string
  data: {
    bgImageWidth: number
    bgImageHeight: number
    templateImageWidth: number
    templateImageHeight: number
    startTime: number
    stopTime: number
    trackList: TrackList[]
  }
}
