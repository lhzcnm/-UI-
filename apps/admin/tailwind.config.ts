import { withTV } from 'tailwind-variants/transformer'
import { preset } from '@3un/ui/preset'
import { resolve } from 'node:path'

const uiPath = resolve('../../packages/ui')
const uiContent = resolve(uiPath, 'src/**/*.vue')

export default withTV({
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
    uiContent,
  ],
  presets: [preset],
  theme: {
    extend: {
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      height: {
        header: 'var(--header-height)',
        container: 'calc(100vh - var(--header-height))',
      },
      margin: {
        sidebar: 'var(--sidebar-width)',
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      },
    },
  },
  safelist: [
    // used by the x-table align prop
    'text-left',
    'text-right',
    'text-center',
  ]
})
