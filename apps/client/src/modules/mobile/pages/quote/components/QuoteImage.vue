<script setup lang="ts">
import router from '@/router'
import loading from './loading.vue'
import * as html2image from 'html-to-image'
import QuoteFreeDialog from './QuoteFreeDialog.vue'
import { deductPoints, freeGenerate } from '../api/quote'
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const now = new Date()
const quoteImageIndex = ref(-1)
const isLoading = ref(false)
const freeShowDialog = ref(false) //免费次数弹框控制按钮
const InsufficientPoints = ref(false) //积分不足的弹窗
const store = inject<quoteType>(QUOTE_STORE)!
const quoteTableRef = ref<HTMLElement[] | null>(null)
const QuoteType = ref<string[]>(['香港拿货报价单','远望新机报价单','飞扬零售报价单'])

const formatted = `${now.getFullYear()}-${(now.getMonth()+1)
  .toString().padStart(2,'0')}-${now.getDate()
  .toString().padStart(2,'0')} ${now.getHours()
  .toString().padStart(2,'0')}:${now.getMinutes()
  .toString().padStart(2,'0')}:${now.getSeconds()
  .toString().padStart(2,'0')}`
const quoteColors: string[] = [
  'bg-gradient-to-br from-black/80 from-30% to-black/20 to-70%',
  'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/20 to-80%',
  'bg-gradient-to-br from-green-500/80 from-30% to-green-500/20 to-80%',
  'bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80%',
  'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/20 to-80%',
  'bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80%'
]

// 滚动监听控制按钮显示
const isScrolling = ref(false)
let scrollTimer: number | null = null
const quotationImageRef = ref<HTMLElement | null>(null)

function handleScroll() {
  isScrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 200)
}



// 生成图片函数
async function generateImage() {
  // 开启 loading
  isLoading.value = true

  try {
    const dom = document.getElementById('quotationImage')!
    if (!dom) return

    const blob = await html2image.toBlob(dom, {
      width: dom.scrollWidth,
      height: dom.scrollHeight,
      skipFonts: true,
      cacheBust: true,
      style: {
        backgroundColor: '#fff'
      }
    })
    if (!blob) return

    const img = new Image()
    const blobUrl = URL.createObjectURL(blob)
    img.src = blobUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(img, 0, 0)

      const text = `${store.quoteWatermark || '陆深三和'}`
      ctx.font = '64px Microsoft YaHei'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.textBaseline = 'middle'

      const stepX = 300
      const stepY = 300
      for (let x = 0; x < canvas.width + stepX; x += stepX) {
        for (let y = 0; y < canvas.height + stepY; y += stepY) {
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate((-20 * Math.PI) / 180)
          ctx.fillText(text, 0, 0)
          ctx.restore()
        }
      }

      canvas.toBlob((finalBlob) => {
        if (!finalBlob) return
        const finalUrl = URL.createObjectURL(finalBlob)
        const a = document.createElement('a')
        a.href = finalUrl
        a.download = '报价单_带水印.png'
        a.click()
        a.remove()
        URL.revokeObjectURL(finalUrl)
        URL.revokeObjectURL(blobUrl)
      })
    }
  } catch (error) {
    console.error('生成图片失败：', error)
  } finally {
    // 关闭 loading（确保无论成功或失败都会关闭）
    isLoading.value = false
  }
}

// 翻页函数
function pageTurn(direction: 'add' | 'sub') {
  const typeMap: Record<string, number> = {
    '香港拿货价': 1,
    '远望新机价': 2,
    '飞扬零售价': 3,
  }

  const len = store.phoneStatusArr.length
  if (len === 0) return

  if (direction === 'add') {
    quoteImageIndex.value = (quoteImageIndex.value + 1) % len
  } else {
    quoteImageIndex.value = (quoteImageIndex.value - 1 + len) % len
  }

  const currentStatus = store.phoneStatusArr[quoteImageIndex.value]
  store.quotationImageType = typeMap[currentStatus] || 1
}

//免费次数
async function generateFree() {
  try {
    const res = await freeGenerate()

    if (res === true) {
      await generateImage()
    }
    else if (res === false) {
      freeShowDialog.value = true
    } 
    else {
      console.log('⚠️ 未知响应:', res)
    }
  } catch (err) {
    console.error('❌ 免费生成失败:', err)
  }
}

//免费次数不足扣除积分
async function deductPoint() {
  try{
    const res = await deductPoints()

    if(res == true){
      generateImage()
    }
    else if (res == false) {
      InsufficientPoints.value = true
    }
  }
  catch(err) {
    console.log(err)
    
  }
}

//免费生成报价免费次数不足确定按钮单点击事件
const handleConfirm = () => {
  console.log('✅ 确定使用积分')
  deductPoint()
}

const handleConfirmPoint = () => {
  console.log('✅ 跳转积分充值页面')
  router.push('/recharge') // 替换为实际路由
}

onMounted(() => {
  // 初始翻页
  if (store.isImageAdd) pageTurn('add')

  // 滚动监听
  if (quotationImageRef.value) {
    quotationImageRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  // 重置翻页状态
  store.isImageAdd = false

  // 移除滚动监听
  if (quotationImageRef.value) {
    quotationImageRef.value.removeEventListener('scroll', handleScroll)
  }
})

</script>

<template>
  <div class="h-full relative">
    <loading v-if="isLoading"/>

    <!-- 报价单图片 -->
    <section
      id="quotationImage"
      ref="quotationImageRef"
      class="border-1 w-full h-full overflow-y-auto relative [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @click="store.IsImageDialog = false"
    >
      <div
        :class="`${quoteColors[store.quoteColorIndex]} relative w-full h-20 px-2 py-1 text-2xl text-white flex items-center justify-center font-bold`"
      >
        {{ QuoteType[store.quotationImageType - 1] }}
        <div class="absolute bottom-0 right-2 text-sm font-thin italic">{{ formatted }}</div>
      </div>

      <div class="bg-orange-200/10 text-orange-500 text-center text-sm w-full px-2 py-1">
        温馨提示:<br />
        要求原装(可以换电芯) 爱思沙漏助手全过 不弹窗 <br />
        主板维修不收,炸弹机器不收 <br />
        报价保签收当天<br />
        靓机: 边框无磕碰 屏幕无划痕 无明显使用痕迹<br />
        小花: 边框小磕碰 屏幕小划痕 轻微使用痕迹<br />
        大花: 边框磕碰大于3出或明显大磕 屏幕大硬伤
      </div>

      <div class="w-full h-10">
        <div>
          <template v-for="(series, si) in store.quotationImageData" :key="si">
            <div
              :class="`${quoteColors[store.quoteColorIndex]} w-full h-10 text-white flex items-center px-3 mt-4`"
            >
              {{ series.type }}
            </div>

            <table
              ref="quoteTableRef"
              class="w-full border-collapse text-center text-sm mb-6"
            >
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2">机型</th>
                  <th class="border p-2">机身内存</th>
                  <th
                    v-for="(col, ci) in series.columns"
                    :key="ci"
                    class="border p-2"
                  >
                    {{ col }}
                  </th>
                  <th class="border p-2">备注</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="(model, mi) in series.models" :key="mi">
                  <tr v-for="(p, pi) in model.prices" :key="pi">
                    <td
                      v-if="pi === 0"
                      class="border p-2"
                      :rowspan="model.prices.length"
                    >
                      {{ model.name }}
                    </td>
                    <td class="border p-2">{{ p.big }}</td>
                    <td
                      v-for="(col, ci) in series.columns"
                      :key="ci"
                      class="border p-2"
                    >
                      {{ p.values[col] ?? '/' }}
                    </td>
                    <td
                      v-if="pi === 0"
                      class="border p-2 text-left"
                      :rowspan="model.prices.length"
                    >
                      {{ model.remark || '/' }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>
      </div>
    </section>

    <transition name="fade-scale">
      <div
        v-if="!isScrolling"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 p-2 text-center z-50"
      >
        <button
          @click="generateFree()"
          class="relative h-12 px-8 text-lg font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden group"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            ✨ 生成报价单
          </span>
          <span
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-60 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
          ></span>
        </button>
      </div>
    </transition>

    <transition name="fadeBtn-scale">
      <div
        v-if="store.quoteImagePageBtnIsOpen && !isScrolling"
        class="fixed bottom-1/2 left-4 z-50"
      >
        <button
          @click="pageTurn('sub')"
          class="h-12 w-12 flex items-center justify-center text-white bg-gradient-to-r from-gray-400/50 to-gray-200 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          ◀
        </button>
      </div>
    </transition>

    <transition name="fadeBtn-scale">
      <div
        v-if="store.quoteImagePageBtnIsOpen && !isScrolling"
        class="fixed bottom-1/2 right-4 z-50"
      >
        <button
          @click="pageTurn('add')"
          class="h-12 w-12 flex items-center justify-center text-white bg-gradient-to-r from-gray-400/50 to-gray-200 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          ▶
        </button>
      </div>
    </transition>
  </div>

  <QuoteFreeDialog
    v-model="freeShowDialog"
    title="免费次数已用完"
    message="是否使用积分生成报价单？"
    @confirm="handleConfirm"
  />

  <QuoteFreeDialog
    v-model="InsufficientPoints"
    title="积分不足"
    message="是否去充值积分？"
    @confirm="handleConfirmPoint"
  />
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.6s ease;
}

.fade-scale-enter-from {
  transform: translate(-50%, 100%) scale(0.9);
  opacity: 0;
}

.fade-scale-leave-to {
  transform: translate(-50%, 150%) scale(0.9);
  opacity: 0;
}

.fadeBtn-scale-enter-active,
.fadeBtn-scale-leave-active {
  transition: all 0.6s ease;
}
.fadeBtn-scale-enter-from,
.fadeBtn-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
