import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import Imports from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { UIResolver } from '@3un/ui'

function resolve(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  envDir: './config',
  plugins: [
    vue(),
    Imports({
      imports: ['vue', 'vue-router'],
      dirs: ['src/stores', 'src/composables'],
    }),
    Components({
      resolvers: [UIResolver()],
      globs: [
        'src/components/**/*.vue',
        '!src/components/logo/*.vue',
        'src/modules/mobile/components/*.vue',
        'src/modules/desktop/components/*.vue',
      ],
    }),
    visualizer() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@auth': resolve('./src/modules/auth'),
      '@desktop': resolve('./src/modules/desktop'),
      '@mobile': resolve('./src/modules/mobile'),
      '@other': resolve('./src/modules/other'),
      '@jweixin': resolve('./src/assets/jweixin'),
    },
  },
})
