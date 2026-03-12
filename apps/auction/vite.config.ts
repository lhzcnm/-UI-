import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Imports from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { UIResolver } from "@3un/ui/resolver"
import { fileURLToPath } from 'url'

function resolve(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  plugins: [
    vue(),
    Imports({
      ignore: ['h'],
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dirs: ['src/stores'],
    }),
    Components({
      resolvers: [UIResolver()],
      globs: [
        'src/components/**/*.vue',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@desktop': resolve('src/modules/desktop'),
      '@mobile': resolve('src/modules/mobile'),
    },
  },
})
