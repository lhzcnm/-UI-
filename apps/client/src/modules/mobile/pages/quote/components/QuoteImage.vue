<script setup lang="ts">
import router from '@/router'
import loading from './loading.vue'
import * as html2image from 'html-to-image'
import QuoteFreeDialog from './QuoteFreeDialog.vue'
import { deductPoints, freeGenerate } from '../api/quote'
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const now = new Date()
const { t } = useI18n()
const quoteImageIndex = ref(-1)
const isLoading = ref(false)
const freeShowDialog = ref(false) //免费次数弹框控制按钮
const InsufficientPoints = ref(false) //积分不足的弹窗
const store = inject<quoteType>(QUOTE_STORE)!
const quoteTableRef = ref<HTMLElement[] | null>(null)
const QuoteType = ref<string[]>([`${t('quote.ImageTableType.HongKong')}`,`${t('quote.ImageTableType.FarVision')}`,`${t('quote.ImageTableType.Flying')}`])

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

watch(
  () => store.quotationImageType,
  async () => {
    // 等 DOM 更新后再绑定
    await nextTick()
    if (quotationImageRef.value) {
      quotationImageRef.value.removeEventListener('scroll', handleScroll)
      quotationImageRef.value.addEventListener('scroll', handleScroll)
    }
  }
)

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

// 固定逻辑编号映射
const TYPE_MAP = {
  HongKong: 1,
  FarVision: 2,
  Flying: 3,
} as const

// 动态翻译标签映射（根据语言自动变化）
const TYPE_LABELS = computed(() => ({
  [t('quote.RealQuote.HongKong')]: 'HongKong',
  [t('quote.RealQuote.FarVision')]: 'FarVision',
  [t('quote.RealQuote.Flying')]: 'Flying',
}))

// 翻页函数
function pageTurn(direction: 'add' | 'sub') {
  const len = store.phoneStatusArr.length
  if (len === 0) return

  // 翻页逻辑（循环切换）
  quoteImageIndex.value =
    direction === 'add'
      ? (quoteImageIndex.value + 1) % len
      : (quoteImageIndex.value - 1 + len) % len

  // 当前语言状态文本（字符串）
  const currentStatus = store.phoneStatusArr[quoteImageIndex.value] as string

  // 反查对应 key
  const typeKey = TYPE_LABELS.value[currentStatus] as keyof typeof TYPE_MAP

  // 设置对应类型编号
  store.quotationImageType = TYPE_MAP[typeKey] ?? 1
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
  isLoading.value = true

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

    <!-- 第一部分：远望新机价表格 -->
    <section v-if="store.quotationImageType == 2" 
      @click="store.IsImageDialog = false"
      id="quotationImage"
      ref="quotationImageRef"
      class="h-full overflow-y-auto w-full bg-white text-gray-800 text-[7px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <!-- 顶部标题 -->
      <div
        :class="`${quoteColors[store.quoteColorIndex]} relative w-full h-20 px-2 py-1 text-white flex items-center justify-center font-bold text-3xl`"
      >
        {{ QuoteType[store.quotationImageType - 1] }}
        <div class="absolute bottom-1 right-3 text-xs font-light italic opacity-90">
          {{ formatted }}
        </div>
      </div>
    
      <!-- 温馨提示 -->
      <div class="bg-orange-200/10 text-orange-500 text-center w-full px-2 py-1 leading-relaxed text-xs" v-html="t('quote.FriendlyReminder.NewContent').replace(/\n/g, '<br />')"></div>

      <!-- 内容主体 -->
      <div class="w-full">
        <template v-for="(series, si) in store.quoteNewImageData" :key="si">
          <!-- 分类标题 -->
          <!-- <div
            :class="`bg-orange-300 w-full h-8 text-white flex items-center justify-center px-3  font-semibold text-xs`"
          >
            {{ series.type == 1 ? 'iPhone 系列报价' : '' }}
          </div> -->
        
        
          <!-- 表格循环 -->
          <template v-for="(phone, i) in series.models" :key="i">
            <!-- ✅ 每个型号独立表头 -->
            <div
              :class="`${quoteColors[store.quoteColorIndex]} w-full h-8 text-white flex items-center justify-center px-3  font-semibold text-xs`"
            >
              {{ phone.model }} {{ t('quote.ImageTableType.Series')}}
            </div>
          
            <table class="w-full border-collapse text-center text-[7px] border border-gray-400">
              <thead>
                <tr class="bg-white text-black">
                  <th class="border border-gray-400 p-1 font-semibold">{{t('quote.ImageTableType.Capacity')}}</th>
                  <th class="border border-gray-400 p-1 font-semibold">{{t('quote.ImageTableType.Color')}}</th>
                  <th class="border border-gray-400 p-1 font-semibold">{{t('quote.ImageTableType.China')}}</th>
                  <th class="border border-gray-400 p-1 font-semibold">{{t('quote.ImageTableType.England')}}</th>
                  <th class="border border-gray-400 p-1 font-semibold">{{t('quote.ImageTableType.Remark')}}</th>
                </tr>
              </thead>
            
              <tbody>
                <template v-for="(type, j) in phone.types" :key="j">
                  <template v-for="(storage, k) in type.storage" :key="k">
                    <template v-for="(color, c) in storage.colors" :key="c">
                      <tr class="bg-white">
                        <!-- 容量 -->
                        <td
                          v-if="c === 0"
                          :rowspan="storage.colors.length"
                          class="p-1 font-medium text-black border border-gray-400 align-middle"
                        >
                          {{ storage.big }}
                        </td>
                      
                        <!-- 颜色 -->
                        <td class="p-1 text-black border border-gray-400 align-middle">
                          {{ color.color || '/' }}
                        </td>
                      
                        <!-- 国行价 -->
                        <td class="p-1 font-medium text-black border border-gray-400 align-middle">
                          {{ color.solid || '/' }}
                        </td>
                      
                        <!-- 美版价 -->
                        <td class="p-1 border border-gray-400 align-middle text-black">
                          {{ color.official || '/' }}
                        </td>
                      
                        <!-- 备注 -->
                        <td
                          v-if="j === 0 && k === 0 && c === 0"
                          :rowspan="phone.types.reduce((tSum, t) => tSum + t.storage.reduce((sSum, s) => sSum + s.colors.length, 0), 0)"
                          class="w-1/4 p-1 text-left align-middle text-black border border-gray-400"
                        >
                          {{ phone.remark || '-' }}
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
              </tbody>
            </table>
          </template>
        </template>
      </div>
    </section>

    <!-- 第二部分：报价单图片部分 飞扬零售价 香港拿货价 -->
    <section
      v-if="store.quotationImageType !== 2"
      id="quotationImage"
      ref="quotationImageRef"
      class="border-1 w-full h-full bg-white overflow-y-auto relative text-[7px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @click="store.IsImageDialog = false"
    >
      <div
        :class="`${quoteColors[store.quoteColorIndex]} relative w-full h-20 px-2 py-1 text-white flex items-center justify-center font-bold text-3xl`"
      >
        {{ QuoteType[store.quotationImageType - 1] }}
        <div class="absolute bottom-0 right-2 text-xs font-thin italic">{{ formatted }}</div>
      </div>
    
      <div class="bg-orange-200/10 text-orange-500 text-center w-full px-2 py-1 leading-relaxed text-xs" v-html="t('quote.FriendlyReminder.Content').replace(/\n/g, '<br />')"></div>

      <div class="w-full">
        <template v-for="(series, si) in store.quotationImageData" :key="si">
          <div
            :class="`${quoteColors[store.quoteColorIndex]} w-full h-8 text-white flex items-center justify-center px-3 font-semibold text-xs`"
          >
            {{ series.type }} {{ t('quote.ImageTableType.Series')}}
          </div>
        
          <table
            ref="quoteTableRef"
            class="w-full border-collapse text-center text-[7px] border border-gray-400 mb-1"
          >
            <thead>
              <tr class="bg-white text-black">
                <th class="border border-gray-400 p-1 font-semibold">{{ t('quote.ImageTableType.Models')}}</th>
                <th class="border border-gray-400 p-1 font-semibold">{{ t('quote.ImageTableType.Capacity')}}</th>
                <th v-for="(col, ci) in series.columns" :key="ci" class="border border-gray-400 p-1 font-semibold">
                  {{ col }}
                </th>
                <th class="border border-gray-400 p-1 font-semibold">{{ t('quote.ImageTableType.Remark')}}</th>
              </tr>
            </thead>
          
            <tbody>
              <template v-for="(model, mi) in series.models" :key="mi">
                <tr v-for="(p, pi) in model.prices" :key="pi" class="bg-white">
                  <td
                    v-if="pi === 0"
                    class="border border-gray-400 p-1 align-middle text-black font-bold"
                    :rowspan="model.prices.length"
                  >
                    {{ model.name }}
                  </td>
                  <td class="border border-gray-400 p-1 text-black">{{ p.big }}</td>
                  <td
                    v-for="(col, ci) in series.columns"
                    :key="ci"
                    class="border border-gray-400 p-1 text-black"
                  >
                    {{ p.values[col] ?? '/' }}
                  </td>
                  <td
                    v-if="pi === 0"
                    class="border border-gray-400 p-1 text-left align-middle text-black w-1/4"
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
    </section>

    <transition name="fade-scale">
      <div
        v-if="!isScrolling"
        class="fixed bottom-8 w-full  p-2 text-center z-50"
      >
        <button
          @click="generateFree()"
          class="relative h-12 w-56 mx-auto  text-lg font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden group"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            ✨ {{ t('quote.QuoteButton.CreateQuotation') }}
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
  transform: translate(0%, 100%) scale(0.9);
  opacity: 0;
}

.fade-scale-leave-to {
  transform: translate(0%, 100%) scale(0.9);
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
