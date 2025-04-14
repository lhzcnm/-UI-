import { withTV } from 'tailwind-variants/transformer'
import { preset } from './src/preset'

export default withTV({
  darkMode: 'class',
  content: ['src/**/*.vue'],
  presets: [preset],
})
