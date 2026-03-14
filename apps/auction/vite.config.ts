import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Imports from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import I18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { UIResolver } from "@3un/ui/resolver"
import { fileURLToPath } from 'url'
import path from 'path'

function resolve(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  envDir: "./config",
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
    I18nPlugin({
      include: path.resolve(__dirname, 'src/locales/locale/**'),
      allowDynamic: true,
      runtimeOnly: false,
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
