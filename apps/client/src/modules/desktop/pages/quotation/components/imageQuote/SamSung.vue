<script setup lang="ts">
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
import { deductPoints, freeGenerate } from '../../api/http'
import router from '@/router'
import QuoteFreeDialog from '../QuoteFreeDialog.vue'
import { WatermarkTool } from '../../utils/Tools'

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

// 标题渐变
const quoteColors: string[] = [
  'bg-gradient-to-br from-black/80 to-black/20',
  'bg-gradient-to-br from-yellow-500/80 to-yellow-500/20',
  'bg-gradient-to-br from-green-500/80 to-green-500/20',
  'bg-gradient-to-br from-blue-500/80 to-blue-500/20',
  'bg-gradient-to-br from-orange-500/80 to-orange-500/20',
  'bg-gradient-to-br from-red-500/80 to-red-500/20'
]

const TABLE_HEADERS = [
  'quote.TableHeaders3.Header1', 
  'quote.TableHeaders3.Header3', 
  'quote.TableHeaders3.Header6',
  'quote.TableHeaders3.Header7'
]

const isScrolling = ref(false)
let scrollTimer: number | null = null
const quoteImage = ref<HTMLElement | null>(null)

function handleScroll() {
  isScrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 200)
}

// 生成图片
async function createImage() {
  await WatermarkTool.generateImage('createImage3', '陆深三和', {
    fontSize: 48,
    opacity: 0.2,
    rotate: -15,
    stepX: 250,
    stepY: 250,
    fileName: '报价单_自定义水印.png'
  })
}

const freeShowDialog = ref(false)
const InsufficientPoints = ref(false)

async function generateFree() {
  try {
    const res = await freeGenerate()
    if (res === true) await createImage()
    else if (res === false) freeShowDialog.value = true
  } catch (err) {
    console.error('❌ 免费生成失败:', err)
  }
}

async function deductPoint() {
  try {
    const res = await deductPoints()
    if (res === true) createImage()
    else if (res === false) InsufficientPoints.value = true
  } catch (err) {
    console.log(err)
  }
}

const handleConfirm = () => deductPoint()
const handleConfirmPoint = () => router.push('/recharge')

onMounted(async () => {
  await nextTick()
  if (quoteImage.value) quoteImage.value.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (quoteImage.value) quoteImage.value.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section
    id="createImage3"
    ref="quoteImage"
    class="border w-full h-full bg-white dark:bg-gray-900 dark:text-gray-100 overflow-y-auto relative text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    @click="store.IsImageDialog = false"
  >
    <!-- 顶部标题 -->
    <div
      :class="[quoteColors[1], 'relative w-full h-14 px-2 py-1 text-white flex items-center justify-center font-bold text-2xl']"
    >
      {{ t('quote.ImageTableType.SamSung') }}
      <div class="absolute bottom-0 right-2 text-xs font-thin italic opacity-90">
        {{ formatted.slice(0, 10) }}
      </div>
    </div>

    <!-- 提示语 -->
    <div
      class="bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200 text-center w-full px-2 py-1 leading-relaxed text-xs"
      v-html="t('quote.FriendlyReminder.SamSung').replace(/\n/g, '<br />')"
    ></div>

    <!-- 型号列表 -->
    <div v-for="(series, si) in store.SanSungData" :key="si" class="mb-2 bg-white dark:bg-gray-800 border dark:border-gray-700">
      <div
        :class="[quoteColors[1], 'relative w-full h-10 px-2 py-1 text-white flex items-center justify-center font-bold text-lg']"
      >
        {{ series.type }}
      </div>

      <div class="flex">
        <table class="w-full table-fixed border-collapse border text-center text-xs dark:border-gray-600">
          <colgroup>
            <col class="w-1/4" />
            <col class="w-1/4" />
            <col class="w-1/4" />
            <col class="w-1/4" />
       
          </colgroup>
          <thead class="bg-yellow-50 dark:bg-yellow-900/40 font-semibold">
            <tr>
              <th
                v-for="header in TABLE_HEADERS"
                :key="header"
                class="border py-2 dark:border-gray-600"
              >
                {{ t(header) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="model in series.models" :key="model.remark">
              <template v-for="price of model.memories" :key="price.memory">
                <!-- 未激活 -->
                <template v-for="(item, idx) in price.colors" :key="'inactive-' + idx">
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td
                      v-if="idx === 0"
                      :rowspan="price.colors.length"
                      class="border px-3 py-2 font-semibold align-middle dark:border-gray-600"
                    >
                      {{ price.memory }}
                    </td>
                    <!-- <td
                      class="border py-2 dark:border-gray-600"
                      v-if="idx === 0"
                      :rowspan="price.inactive.length"
                    >
                      {{ t('quote.TableHeaders.Header4') }}
                    </td> -->
                    <td class="border px-3 py-2 dark:border-gray-600">{{ item.color }}</td>
                    <td class="border px-3 py-2 dark:border-gray-600">{{ store.priceIcon }}: {{ item.prices.BrandNew }}</td>
                    
                    <td
                      v-if="idx === 0"
                      :rowspan="price.colors.length"
                      class="border px-3 py-2 text-center align-middle dark:border-gray-600"
                    >
                      {{ model.remark || '/' }}
                    </td>
                  </tr>
                </template>

                <!-- 已激活 -->
                <!-- <template v-for="(item, idx) in price.active" :key="'active-' + idx">
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td
                      class="border py-2 dark:border-gray-600"
                      v-if="idx === 0"
                      :rowspan="price.active.length"
                    >
                       {{ t('quote.TableHeaders.Header3') }}
                    </td>
                    <td class="border px-3 py-2 dark:border-gray-600">{{ t(ColorEnumNames[item.color]) }}</td>
                    <td class="border px-3 py-2 dark:border-gray-600">{{ item.prices.primary }}</td>
                    <td class="border px-3 py-2 dark:border-gray-600">{{ item.prices.secondary }}</td>
                    <td class="border px-3 py-2 dark:border-gray-600">{{ item.prices.source }}</td>
                  </tr>
                </template> -->
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>

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
                 rounded-2xl
                 hover:-translate-y-0.5 active:translate-y-0
                 transition-all duration-300 overflow-hidden group"
        >
          ✨ {{ t('quote.QuoteButton.CreateQuotation') }}
        </button>
      </div>
    </transition>
  </section>

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
