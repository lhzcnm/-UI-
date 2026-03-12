import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  envDir: './config',
  plugins: [vue()],

  resolve: {
    alias: {
      '@': resolve('src'),
      '@client': resolve('src/modules/client'),
      '@admin': resolve('src/modules/admin')
    }
  }
})