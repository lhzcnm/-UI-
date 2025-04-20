import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  platform: 'browser',
  format: ['esm'],
  minify: true,
  clean: true,
  dts: true,
})
