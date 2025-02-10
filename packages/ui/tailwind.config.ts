import { withTV } from 'tailwind-variants/transformer'
import XPreset from '@3un/shared/presets'

export default withTV({
  darkMode: 'class',
  content: ['src/**/*.vue'],
  presets: [XPreset],
})
