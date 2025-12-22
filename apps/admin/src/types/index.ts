export const modeOptions = {
  "AiSuCha": { width: '16rem' },
  "HaoXuan": { width: '12rem' },
  "IFunlock": { width: '12rem' },
  "JiuXing": { width: '12rem' },
  "LuShen": { width: '12rem' },
  "SanHe": { width: '12rem' },
  "U4GSM": { width: '12rem' },
  "Usimlte": { width: '16rem' },
  "ZSunlock": { width: '16rem' },
}

export type ModeKey = keyof typeof modeOptions

export interface ModeLogo {
  width: string,
}

export type ModeItem = Record<ModeKey, ModeLogo>
