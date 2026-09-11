<script setup lang="ts">
import type { ServiceDetail, ServiceView } from '@/api/services'

interface ServiceGroupDialogProps {
  group: ServiceDetail
}

const props = defineProps<ServiceGroupDialogProps>()
const visible = defineModel<boolean>({ required: true })

const router = useRouter()
const search = ref('')
const localStore = useLocalStore()

const filteredChildren = computed<ServiceView[]>(() => {
  if (!search.value) return props.group.children as ServiceView[]
  const val = search.value.trim().toLowerCase()
  const result: ServiceView[] = []

  for (const item of props.group.children) {
    const name = item.title
    const id = item.id.toString()
    const nameLower = name.toLowerCase()
    const isIdMatch = id.includes(val)
    const isNameMatch = nameLower.includes(val)

    if (isIdMatch || isNameMatch) {
      result.push({
        ...item,
        idHighlight: isIdMatch ? highlightText(id, val) : id,
        title: isNameMatch ? highlightText(name, val) : name,
      })
    }
  }

  return result
})

function highlightText(text: string, search: string): string {
  if (!search) return text
  const regex = new RegExp(`(${search})`, 'gi')
  return text.replace(regex, '<mark class="x-highlight">$1</mark>')
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-id]')

  if (!element) return

  const dataId = element.getAttribute('data-id')
  const id = parseInt(dataId || '0')

  router.push(`/submit/${id}`)
}
</script>

<template>
  <XDialog
    v-model="visible" :title="localStore.localData['home_ServiceList']"
    ui-root="sm:max-w-screen-lg rounded-2xl overflow-hidden"
    @close="search = ''"
  >
    <!-- 增加内部留白和网格间距 -->
    <div class="space-y-6 p-2">
      <!-- 搜索区 -->
      <div class="flex items-center justify-between">
        <XInput 
          v-model="search" 
          :placeholder="localStore.localData['home_SearchServices']" 
          ui-root="w-72 rounded-xl border-slate-200 focus:border-[#C7000B] focus:ring-[#C7000B]/20 transition-all duration-200" 
          autofocus 
          clearable 
        />
        <!-- 可在此处添加筛选标签等 -->
      </div>
      
      <!-- 滚动内容区 -->
      <div class="h-[min(calc(100vh-280px),600px)] overflow-y-auto pr-2 custom-scrollbar" type="auto">
        <div
          class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,_1fr))] pb-4"
          @click="handleClick"
        >
          <!-- 注意：这里的 ServiceItemCard 是全局组件，它的样式决定了弹窗内卡片的样子 -->
          <ServiceItemCard
            v-for="item in filteredChildren"
            :key="item.id" :data="item"
            :data-id="item.id"
            class="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-6px_rgba(199,0,11,0.1)] hover:border-[#C7000B]/20 transition-all duration-300 cursor-pointer"
          />
        </div>
      </div>
    </div>
  </XDialog>
</template>

<style scoped>
/* 自定义极简滚动条（华为风格细节） */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>