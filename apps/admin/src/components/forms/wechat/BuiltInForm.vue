<script setup lang="ts">
import type { BuiltInMessage } from '@/inters/wechat'
import { zBuiltInMsg } from '@/inters/wechat'

interface BuiltInFormProps {
  builtInList: BuiltInMessage[]
}

const props = defineProps<BuiltInFormProps>()
const form = defineModel<BuiltInMessage>({ required: true })

function handleSelect(id: number) {
  const item = props.builtInList.find(item => item.id === id)
  if (item) form.value = zBuiltInMsg.parse(item)
}
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label for="type" class="block mb-1 text-sm text-label">消息类型</label>
      <XSelect v-model="form.id" placeholder="请选择消息类型" @selected="handleSelect">
        <XSelectItem
          v-for="item in builtInList" :key="item.id"
          :value="item.id" :label="item.label"
        />
      </XSelect>
    </div>
    <div v-show="form.hasKeywords">
      <label for="keywords" class="block mb-1 text-sm text-label">关键字。多个关键字，请使用(|)分隔</label>
      <XInput id="keywords" v-model="form.keywords" placeholder="例如：你好|您好|在吗" />
    </div>
    <div>
      <label for="content1" class="block mb-1 text-sm text-label">附加内容1(可选)</label>
      <XTextarea id="content1" v-model="form.content1" rows="5" placeholder="请输入附加内容" />
    </div>
    <div>
      <label for="content2" class="block mb-1 text-sm text-label">附加内容2(可选)</label>
      <XTextarea id="content2" v-model="form.content2" rows="5" placeholder="请输入附加内容" />
    </div>
  </form>
</template>
