import { resolve } from 'node:path'

import XPreset from '@3un/shared/presets'
import { withTV } from 'tailwind-variants/transformer'

const uiPath = resolve('../../packages/ui')
const uiContent = resolve(uiPath, 'src/**/*.vue')

export default withTV({
  darkMode: 'class',
  presets: [XPreset],
  content: [
    './index.html',
    './src/**/*.vue',
    uiContent,
  ],
  theme: {
    extend: {
      width: {
        'sidebar': 'var(--siderbar-width)',
        'main': 'calc(100vw - var(--siderbar-width))',
      },
      height: {
        'header': 'var(--header-height)',
        'main': 'calc(100vh - var(--header-height))',
      },
      maxWidth: {
        'main': 'calc(100vw - var(--siderbar-width))',
      },
    },
  },
  safelist: [
    // use by ag-grid table
    'leading-6',
    'py-1',
  ],
})
