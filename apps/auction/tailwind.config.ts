import { withTV } from 'tailwind-variants/transformer'
import { preset } from '@3un/ui/preset'
import { resolve } from 'node:path'

const uiPath = resolve('../../packages/ui')
const uiContent = resolve(uiPath, 'src/**/*.{vue,ts}')

export default withTV({
  content: [
    'index.html',
    'src/**/*.{vue,ts}',
    uiContent,
  ],
  presets: [preset],
  theme: {
    extend: {
      width: {
      },
      height: {
      },
      maxWidth: {
      },

      keyframes: {
      },
      animation: {
      },
    },
  },
})
