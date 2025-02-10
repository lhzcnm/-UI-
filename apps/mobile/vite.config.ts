import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import { UIResolver } from '@3un/ui'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Comps from 'unplugin-vue-components/vite'
import Imports from 'unplugin-auto-import/vite'
// import obfuscator from 'vite-plugin-bundle-obfuscator'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  envDir: resolve('../../config'),
  plugins: [
    vue(),
    Icons({ autoInstall: true }),
    Comps({ resolvers: [UIResolver()] }),
    Imports({
      imports: ['vue', 'vue-router'],
      dirs: ['src/composables', 'src/utils', 'src/stores'],
    }),
    // obfuscator({
    //   threadPool: { enable: true, size: 4 },
    //   autoExcludeNodeModules: true,
    // }),
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('src/pages')) return 'pages'
        }
      }
    }
  },
})
