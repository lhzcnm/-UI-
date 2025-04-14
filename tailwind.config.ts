import { withTV } from 'tailwind-variants/transformer'
import XPreset from './presets'

export default withTV({
  darkMode: 'class',
  content: ['src/**/*.vue'],
  presets: [XPreset],
})
