import { withTV } from 'tailwind-variants/transformer'
import { resolve } from 'node:path'

import XPreset from '@3un/shared/presets'

const uiPath = resolve('../../packages/ui')
const uiContent = resolve(uiPath, 'src/**/*.vue')

export default withTV({
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
    uiContent,
  ],
  presets: [XPreset],
  theme: {
    extend: {
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      height: {
        header: 'var(--header-height)',
        container: 'calc(100vh - var(--header-height))',
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      },
    },
  },
  safelist: [
    // use by ag-grid table
    'leading-6',
    'py-1',
  ],
})
