import { fileURLToPath, URL } from 'node:url'
import { build } from 'vite'

import obfuscator from 'vite-plugin-bundle-obfuscator'
import fs from 'node:fs/promises'

const list = [
  { mode: 'SanHe', obfuscator: false },
  { mode: 'HaoXuan', obfuscator: false },
  // { mode: 'AiSuCha', obfuscator: false },
  // { mode: 'LuShen', obfuscator: false },
  // { mode: 'IFunlock', obfuscator: true },
  // { mode: 'JiuXing', obfuscator: true },
  // { mode: 'U4GSM', obfuscator: true },
]

await Promise.all(list.map(run))

for (const item of list) {
  await clean(item.mode)
}

function resolve(path) {
  return fileURLToPath(new URL(path, import.meta.url))
}

async function run(item) {
  const plugins = []

  if (item.obfuscator) {
    plugins.push(
      obfuscator({
        log: false,
        threadPool: true,
        excludes: [
          'vendor',
          'vendor-utils',
          'jsencrypt',
          'echarts',
          'tiptap',
        ],
        options: {
          controlFlowFlattening: false,
          transformObjectKeys: false,
          deadCodeInjection: false,
          stringArray: false,
        }
      })
    )
  }

  await build({
    plugins,
    envDir: './config',
    mode: item.mode,
    build: {
      chunkSizeWarningLimit: 1024,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      sourcemap: true,
      rollupOptions: {
        output: {
          dir: `./dist/${item.mode}`,
          manualChunks
        },
      },
    },
  })
}

async function clean(mode) {
  for (const item of list) {
    if (item.mode !== mode) {
      await fs.rm(
        resolve(`../dist/${mode}/${item.mode}`),
        { recursive: true, force: true }
      )
    }
  }
}

function manualChunks(id) {
  if (id.includes('jsencrypt')) return 'jsencrypt'
  if (
    id.includes('tiptap') ||
    id.includes('prosemirror') ||
    id.includes('w3c-keyname') || 
    id.includes('orderedmap') || 
    id.includes('rope-sequence')
  ) return 'tiptap'

  if (
    id.includes('echarts') ||
    id.includes('zrender') ||
    id.includes('tslib')
  ) return 'echarts'

  if (
    id.includes('@vueuse') ||
    id.includes('@floating-ui') ||
    id.includes('@iconify/vue') ||
    id.includes('tailwind') ||
    id.includes('vue-sonner') ||
    id.includes('axios') ||
    id.includes('dayjs') ||
    id.includes('ohash') || 
    id.includes('klona')
  ) return 'vendor-utils'

  if (id.includes('node_modules')) return 'vendor'

  if (id.includes('modules/other')) return 'other'
  if (id.includes('modules/desktop')) return 'desktop'
  if (id.includes('modules/mobile')) return 'mobile'
  if (id.includes('modules/auth')) return 'auth'

  return 'common'
}
