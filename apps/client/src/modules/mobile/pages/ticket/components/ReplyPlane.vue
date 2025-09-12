<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { TICKET_STATUS } from '@3un/utils'
import { TICKET_STORE, getAvatar } from '../utils'
import { ticketApi } from '@/api/tickets'
import { toast } from 'vue-sonner'

const uStore = useUserStore()

const visible = defineModel<boolean>({ default: false })
const store = inject(TICKET_STORE)!

const msg = ref('')

const { t } = useI18n()

const currentTicket = computed(() => {
  if (store.index === undefined) return
  return store.tickets[store.index]
})

const isSolved = computed(() => {
  const status = currentTicket.value!.statusId
  return status === TICKET_STATUS.SOLVED
})

function handleSubmit() {
  if (isSolved.value) return
  if (msg.value.trim() === '') {
    toast.warning(t('ticket.prompt.msgNull'))
    return
  }

  const response = ticketApi.reply({
    ticketId: currentTicket.value!.id,
    msg: msg.value,
  })

  response.then(({ data }) => {
    store.replies.push(data)
    msg.value = ''
  })
}
</script>

<template>
  <SlideRight
    v-model="visible"
    header-class="border-b"
    :title="currentTicket?.subject"
    @close="store.index = undefined"
  >
    <div class="flex flex-col h-full">
      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <div
          v-for="reply in store.replies" :key="reply.id" 
          :class="twMerge(
            'flex items-start',
            reply.replyId === null && 'flex-row-reverse'
          )"
        >
          <img 
            :src="getAvatar(reply.replyId, uStore.info.avatar)"
            :alt="reply.replyId ? t('ticket.customer') : t('ticket.user')"
            class="flex-shrink-0 size-8 rounded-full object-cover"
            draggable="false"
          />
          <div
            :class="twMerge(
              'max-w-[80%] p-3 mx-2 rounded-lg bg-success/20',
              reply.replyId === null && 'bg-primary/20',
            )"
          >
            <p class="text-sm whitespace-pre-wrap mb-1">{{ reply.msg }}</p>
            <div class="flex items-center justify-end text-xs text-muted-foreground">
              <span>{{ reply.time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex space-x-2 border-t p-3">
        <textarea
          v-model="msg"
          :class="twMerge(
            'w-full h-full pl-2 text-base sm:text-sm bg-transparent',
            'resize-none focus:outline-none'
          )"
          :placeholder="t('ticket.placeholder.chat')"
          rows="3"
        />
        <XButton
          :disabled="isSolved"
          @click="handleSubmit"
          :label="t('ticket.title.send')"
        />
      </div>
    </div>
  </SlideRight>
</template>
