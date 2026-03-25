import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => path.resolve(__dirname, p)

const MAX_WORKERS = 4

const list = [
  { mode: 'SanHe', obfuscator: false },
  { mode: 'HaoXuan', obfuscator: false },
  { mode: 'AiSuCha', obfuscator: false },
  { mode: 'LuShen', obfuscator: false },
  { mode: 'IFunlock', obfuscator: true },
  { mode: 'JiuXing', obfuscator: true },
  { mode: 'U4GSM', obfuscator: true },
  { mode: 'Usimlte', obfuscator: true },
  { mode: 'ZSunlock', obfuscator: true },
]

async function runInWorker(item) {
  return new Promise((resolveWorker, reject) => {
    const worker = new Worker(resolve('./worker.js'), {
      workerData: { item }
    })
    worker.on('message', resolveWorker)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })
  })
}

async function clean(mode) {
  for (const item of list) {
    if (item.mode !== mode) {
      const target = resolve(`../dist/${mode}/${item.mode}`)
      await fs.rm(target, { recursive: true, force: true }).catch(() => {})
    }
  }
}

async function main() {
  console.time('Total Build Time')
  
  for (let i = 0; i < list.length; i += MAX_WORKERS) {
    const chunk = list.slice(i, i + MAX_WORKERS)
    console.log(`\n📦 Batch build: ${chunk.map(v => v.mode).join(', ')}`)
    await Promise.all(chunk.map(item => runInWorker(item)))
  }

  console.log('\n🧹 Starting cleanup...')
  await Promise.all(list.map(item => clean(item.mode)))
  
  console.log('\n✅ All builds and cleanups completed!')
  console.timeEnd('Total Build Time')
}

main().catch(err => {
  console.error('💥 Build Failed:', err)
  process.exit(1)
})
