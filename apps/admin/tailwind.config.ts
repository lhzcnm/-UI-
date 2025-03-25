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
  safelist: [
    // use by ag-grid table
    'leading-6',
    'py-1',
  ],
})
