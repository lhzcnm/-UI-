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
  safelist: [
    // use by ag-grid table
    'leading-6',
    'py-1',
  ],
})
