<script setup lang="ts">
import type { TicketCreateForm, TicketType } from '@/api/tickets'
import { TICKET_PRIORITY_LIST } from '@3un/utils';

interface BaseFormProps {
  typeList: TicketType[]
}

const props = defineProps<BaseFormProps>()
const form = defineModel<TicketCreateForm>({ required: true })

const { locale } = useI18n()


function handleDepartName(item: TicketType) {
  let res = item.departmentName

  if(locale.value === 'en' && item.departmentNameEn) {
    res = item.departmentNameEn
  }

  return res
}

const localStore = useLocalStore()


onMounted(() => {
  console.log(TICKET_PRIORITY_LIST)
  localStore.getLocalData()
})

</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['ticket_TicketType'] }}</label>
      <XSelect v-model="form.type">
        <XSelectItem
          v-for="item in props.typeList" :key="item.departmentId"
          :value="item.departmentId" :label="handleDepartName(item)"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['ticket_PriorityLevel'] }}</label>
      <XSelect v-model="form.priority">
        <XSelectItem
          v-for="item in TICKET_PRIORITY_LIST" :key="item.value"
          :value="item.value" :label="localStore.localData[item.key]"
        > </XSelectItem>
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['ticket_TicketSubject'] }}</label>
      <XInput v-model="form.subject" :placeholder="localStore.localData['ticket_OrderUnlockFailed']" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['ticket_FeedbackContent'] }}</label>
      <XTextarea v-model="form.msg" rows="5" :placeholder="localStore.localData['ticket_placeholderMsg']" />
    </div>
  </form>
</template>
