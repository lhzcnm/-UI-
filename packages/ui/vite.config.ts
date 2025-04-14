import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Imports from 'unplugin-auto-import/vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    Imports({ imports: ['vue'] }),
    dts({ rollupTypes: true, }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/preset.ts'),
        resolve(__dirname, 'src/resolver.ts')
      ],
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'dayjs',
        '@iconify/vue',
        '@floating-ui/vue',
        '@vueuse/core',
        'tailwind-merge',
        'tailwind-variants',
      ],
      output: {
        assetFileNames: 'index.css'
      }
    },
  },
})
