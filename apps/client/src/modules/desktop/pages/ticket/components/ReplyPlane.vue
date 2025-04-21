<script setup lang="ts">
import { twJoin, twMerge } from 'tailwind-merge'
import { TICKET_STORE, getAvatar } from '../utils'
import { TICKET_STATUS } from '@3un/shared/enums'
import { ticketApi } from '@/api/tickets'
import { toast } from 'vue-sonner'

const uStore = useUserStore()
const store = inject(TICKET_STORE)!

const msg = ref('')
const isSolved = computed(() => {
  const status = currentTicket.value!.statusId
  return status === TICKET_STATUS.SOLVED
})

const currentTicket = computed(() => {
  if (store.index === undefined) return
  return store.tickets[store.index]
})

function handleSubmit() {
  if (isSolved.value) return
  if (msg.value.trim() === '') {
    toast.warning('不能发送空消息')
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
  <div class="flex-1 bg-card border rounded-lg">
    <NoMessage v-if="store.replies.length === 0" />
    <template v-else>
      <section
        :class="twJoin(
          'flex items-center justify-between',
          'border-b border-dashed p-4 pb-3',
        )"
      >
        <h2 class="text-lg font-bold">{{ currentTicket!.subject }}</h2>
      </section>
      <section class="flex flex-col h-[calc(100vh-9.75rem)]">
        <div class="flex-1 overflow-y-auto space-y-4 p-4">
          <div
            v-for="reply in store.replies" :key="reply.id" 
            :class="twMerge(
              'flex items-start',
              reply.replyId === null && 'flex-row-reverse'
            )"
          >
            <img 
              :src="getAvatar(reply.replyId, uStore.info.avatar)"
              :class="twMerge(
                'size-8 rounded-full object-cover flex-shrink-0',
              )"
              :alt="reply.replyId ? '客服' : '用户'"
              draggable="false"
            />
            <div
              :class="twMerge(
                'max-w-[80%] p-3 mx-3 rounded-lg bg-teal-600/20',
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
            placeholder="请输入回复内容"
            rows="5"
          />
          <XButton
            label="发送"
            :disabled="isSolved"
            @click="handleSubmit"
          />
        </div>
      </section>
    </template>
  </div>
</template>
