import { resolve } from 'path'
import { preset } from '@3un/ui/preset'

const uiPath = resolve("../../packages/ui")
const uiContent = resolve(uiPath, "src/**/*.{vue,ts}")

export default ({
  content:[
    "index.html",
    "src/**/*.{vue,ts}",
    uiContent,
  ],
  
  presets: [preset],
  theme: {
    extend: {}
  }
})