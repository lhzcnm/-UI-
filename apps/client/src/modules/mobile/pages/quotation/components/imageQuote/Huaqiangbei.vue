<script setup lang="ts">
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
import { WatermarkTool } from '../../utils/Tools'
import { deductPoints, freeGenerate} from '../../api/http'
import router from '@/router'
import QuoteFreeDialog from '../QuoteFreeDialog.vue'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { t } = useI18n()
const now = new Date()

const formatted = `${now.getFullYear()}-${(now.getMonth() + 1)
  .toString()
  .padStart(2, '0')}-${now
  .getDate()
  .toString()
  .padStart(2, '0')} ${now
  .getHours()
  .toString()
  .padStart(2, '0')}:${now
  .getMinutes()
  .toString()
  .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

const quoteColors: string[] = [
  'bg-gradient-to-br from-black/80 from-30% to-black/20 to-70%',
  'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/20 to-80%',
  'bg-gradient-to-br from-green-500/80 from-30% to-green-500/20 to-80%',
  'bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80%',
  'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/20 to-80%',
  'bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80%'
]

// 表头字段
const TABLE_HEADERS = ['quote.TableHeaders.Header1', 'quote.TableHeaders.Header2', 'quote.TableHeaders.Header3', 'quote.TableHeaders.Header4', 'quote.TableHeaders.Header5']

// 滚动监听控制按钮显示
const isScrolling = ref(false)
let scrollTimer: number | null = null
const quoteImage = ref<HTMLElement | null>(null)

function handleScroll() {
   console.log('scrolling...');
  isScrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 200)
}

/** 生成图片函数 */ 
async function createImage () {
  await WatermarkTool.generateImage('createImage2', '陆深三和', {
    fontSize: 48,
    opacity: 0.2,
    rotate: -15,
    stepX: 250,
    stepY: 250,
    fileName: '报价单_自定义水印.png'
  })
}

const freeShowDialog = ref(false) //免费次数弹框控制按钮
const InsufficientPoints = ref(false) //积分不足的弹窗

//免费次数
async function generateFree() {
  try {
    const res = await freeGenerate()

    if (res === true) {
      await createImage()
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
      createImage()
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
  deductPoint()
}

const handleConfirmPoint = () => {
  router.push('/recharge') 
}


onMounted(async () => {
   await nextTick()
  // 滚动监听
  if (quoteImage.value) {
    console.log(1);
    
    quoteImage.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  // 移除滚动监听
  if (quoteImage.value) {
    quoteImage.value.removeEventListener('scroll', handleScroll)
  }
})

</script>

<template>
  <div class="h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
    <section
      id="createImage2"
      ref="quoteImage"
      class="border w-full h-full overflow-y-auto relative text-[8px] 
             border-gray-200 dark:border-gray-700 
             [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @click="store.IsImageDialog = false"
    >
      <!-- 顶部标题 -->
      <div
        :class="`${quoteColors[2]} relative w-full h-14 px-2 py-1 text-white flex items-center justify-center font-bold text-2xl
        dark:from-green-600 dark:to-green-400`"
      >
        {{ t('quote.ImageTableType.HuaQiangBei') }}
        <div class="absolute bottom-0 right-2 text-[8px] font-thin italic opacity-90">
          {{ formatted.slice(0,10) }}
        </div>
      </div>

      <!-- 提示语 -->
      <div
        class="bg-green-50 dark:bg-green-900/30 dark:text-green-300 text-center w-full px-2 py-1 leading-relaxed text-[8px]"
        v-html="t('quote.FriendlyReminder.HuaQiangBei').replace(/\n/g, '<br />')"
      ></div>

      <!-- 表格区域 -->
      <div v-for="(series, si) in store.HuaQiangBeiData" :key="si" class="mb-3">
        <!-- 型号标题 -->
        <div
          :class="`${quoteColors[2]} relative w-full h-10 px-2 py-1 text-white flex items-center justify-center font-bold text-lg
          dark:from-green-600 dark:to-green-400`"
        >
          {{ series.model }}
        </div>

        <div class="flex">
          <table
            class="w-full table-fixed border-collapse border border-gray-200 dark:border-gray-700
                   text-center text-[8px] transition-colors duration-200"
          >
            <colgroup>
              <col class="w-1/5" />
              <col class="w-1/5" />
              <col class="w-1/5" />
              <col class="w-1/5" />
              <col class="w-1/5" />
            </colgroup>

            <thead class="bg-green-50 dark:bg-green-800/40 font-semibold">
              <tr>
                <th
                  v-for="header in TABLE_HEADERS"
                  :key="header"
                  class="border border-gray-200 dark:border-gray-700 px-3 py-2"
                >
                  {{ t(header) }}
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-for="model in series.models">
                <template v-for="(p, i) in model.prices" :key="i">
                  <template v-for="(item, idx) in p.list" :key="idx">
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td
                        v-if="idx === 0"
                        :rowspan="p.list.length"
                        class="border border-gray-200 dark:border-gray-700 px-3 py-2 font-semibold align-middle"
                      >
                        {{ p.memory }}
                      </td>

                      <td class="border border-gray-200 dark:border-gray-700 px-3 py-2">
                        {{ item.color }}
                      </td>

                      <td class="border border-gray-200 dark:border-gray-700 px-3 py-2">
                        ￥: {{ item.prices.primary }} 
                      </td>

                      <td class="border border-gray-200 dark:border-gray-700 px-3 py-2">
                        ￥: {{ item.prices.secondary }} 
                      </td>

                      <td
                        v-if="i === 0 && idx === 0"
                        :rowspan="model.prices.reduce((n, m) => n + m.list.length, 0)"
                        class="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center align-middle"
                      >
                        {{ model.remark || '/' }}
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 按钮 -->
    <transition name="fade-scale">
      <div
        v-if="!isScrolling"
        class="fixed bottom-8 left-1/2 p-2 text-center z-50"
        :style="{ transform: 'translateX(-50%)' }"
      >
        <button
          @click="generateFree()"
          class="relative h-12 w-56 text-lg font-semibold tracking-wide text-white 
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                 rounded-2xl shadow-lg dark:shadow-purple-800/30 
                 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 
                 transition-all duration-300 overflow-hidden group"
        >
          <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
            ✨ {{ t('quote.QuoteButton.CreateQuotation') }}
          </span>
          <span
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-60 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
          ></span>
        </button>
      </div>
    </transition>
  </div>

  <!-- 弹窗 -->
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
</style>
