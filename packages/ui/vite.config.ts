import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Imports from 'unplugin-auto-import/vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    Icons({ autoInstall: true }),
    Imports({ imports: ['vue'] }),
    dts({ rollupTypes: true }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        tailwindcss(),
      ],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        '@floating-ui/vue',
        'tailwind-merge',
        'tailwind-variants',
      ],
    },
  },
})
