<script setup lang="ts">
import { type ActivitySearch } from '@/inters/activity'
import { ACTIVITY_STATUS_LIST } from '@3un/utils'

const form = defineModel<ActivitySearch>({ required: true, })
</script>

<template>
  <form class="space-y-4 flex flex-col" @submit.prevent>
    <div>
      <label class="text-label text-sm mb-1">活动名称</label>
      <XInput placeholder="请输入活动名称" v-model="form.activityName" />
    </div>
    <div>
      <label class="text-label text-sm mb-1">活动状态</label>
      <XSelect v-model="form.status">
        <XSelectItem
          v-for="item in ACTIVITY_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label" />
      </XSelect>
    </div>
    <div class="w-full flex justify-between space-x-3">
      <div class="flex-1">
        <label class="text-label text-sm mb-1">开始时间</label>
        <XDatePicker
          label-format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          v-model="form.startTime"
          :visible-time="true" />
      </div>
      <div class="flex-1">
        <label class="text-label text-sm mb-1">结束时间</label>
        <XDatePicker
          label-format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束时间"
          v-model="form.endTime"
          :visible-time="true" />
      </div>
    </div>
  </form>
</template>
