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
        sidebar: 'var(--siderbar-w)',
        container: 'calc(100vw - var(--siderbar-w))',
      },
      height: {
        header: 'var(--header-h)',
        container: 'calc(100vh - var(--header-h))',
      },
      keyframes: {
      },
      animation: {
      },
    },
  },
})
