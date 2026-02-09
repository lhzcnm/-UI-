<script setup lang="ts">
import { updateUpstream } from '@/api/upstream';
import type { Upstream } from '@/inters/upstream';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props { 
  serverUrl: string
  row: Upstream
}

const props = defineProps<Props>()
/** 编辑状态 */
const isEdit = ref(false)
const editValue = ref(props.serverUrl)

/** 根节点引用 */
const rootRef = ref<HTMLElement | null>(null)

/** 同步外部值 */
watch(
  () => props.serverUrl,
  (val) => {
    if (!isEdit.value) {
      editValue.value = val
    }
  }
)

/** 解析 URL */
const parsed = computed(() => {
  if (!props.serverUrl) return { url: '', params: [] as { key: string; value: string }[] }

  const [url, query] = props.serverUrl.split('?')

  if (!query) return { url, params: [] }

  const params = query.split('&').map(item => {
    const [key, value] = item.split('=')
    return {
      key: decodeURIComponent(key || ''),
      value: decodeURIComponent(value || '--')
    }
  })

  return { url, params }
})

/** 进入编辑 */
const startEdit = () => {
  editValue.value = props.serverUrl
  isEdit.value = true
}

// api编辑
async function handleUpdate() {
  const body = { ...props.row, serverUrl: editValue.value }
  await updateUpstream(body)

}

/** 保存 */
const save = () => {
  if (!isEdit.value) return
  isEdit.value = false
  handleUpdate()
  
}

/** 取消 */
const cancel = () => {
  isEdit.value = false
  editValue.value = props.serverUrl
}

/** 点击外部处理 */
const handleClickOutside = (e: MouseEvent) => {
  if (!isEdit.value) return
  if (!rootRef.value) return

  if (!rootRef.value.contains(e.target as Node)) {
    save()   
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef">
    <XTextarea
      v-if="isEdit"
      v-model="editValue"
      autofocus
      @keyup.enter="save"
      @keyup.esc="cancel"
    />

    <!-- 展示态 -->
    <div v-else @click="startEdit">
      <div>
        {{ parsed.url }}
      </div>

      <div v-if="parsed.params.length">
        <div 
          v-for="(item, index) in parsed.params" 
          :key="index"
        >
          <span>{{ item.key }}</span>
          <span>：</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
