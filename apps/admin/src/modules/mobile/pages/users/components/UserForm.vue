<script setup lang="ts">
import type { UserCreateParams } from '@/inters/users'

interface UserFormEmits {
  (e: 'update:api-key'): void
  (e: 'update:bulk-api-key'): void
}

const emit = defineEmits<UserFormEmits>()
const form = defineModel<UserCreateParams>({ required: true })
const levelStore = useLevelStore()
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField label="会员等级" desc="会员等级">
      <XNativeSelect
        v-model="form.pricePlanId"
        :options="levelStore.levels"
        value-key="pricePlanId"
        label-key="pricePlan"
      />
    </FormField>

    <FormField label="用户账号" desc="6-16位数字、字母、下划线" required>
      <XInput v-model="form.userName" placeholder="用户账号" />
    </FormField>

    <FormField label="用户昵称" desc="用户昵称，同步微信名称" required>
      <XInput v-model="form.nickName" placeholder="用户昵称" />
    </FormField>

    <FormField label="密码" desc="8-18位密码。支持特殊字符" required>
      <XInput v-model="form.userPassword" placeholder="密码" />
    </FormField>

    <FormField label="微信ID" desc="微信ID">
      <XInput v-model="form.weiXinOpenid" placeholder="微信ID" />
    </FormField>

    <FormField label="邮箱" desc="邮箱地址">
      <XInput v-model="form.userEmail" placeholder="邮箱" />
    </FormField>

    <FormField label="手机号" desc="11位手机号">
      <XInput v-model="form.phone" placeholder="手机号" />
    </FormField>

    <FormField label="会员到期" desc="会员到期时间">
      <XNativeDate v-model="form.memberExp" placeholder="会员到期" />
    </FormField>

    <FormField label="API 密钥" desc="用于 API 提交订单" variant="vertical">
      <XInput v-model="form.apiKey" placeholder="API 密钥" disabled />
      <XButton @click="emit('update:api-key')">刷新</XButton>
    </FormField>

    <FormField label="批量查询密钥" desc="用于批量查询订单" variant="vertical">
      <XInput v-model="form.bulkCheckApi" placeholder="批量查询密钥" disabled />
      <XButton @click="emit('update:bulk-api-key')">刷新</XButton>
    </FormField>

    <FormField label="API白名单" desc="仅允许这些IP使用API" variant="vertical">
      <XTextarea v-model="form.ips" placeholder="每行仅限一个IP" rows="4" />
    </FormField>

    <FormField label="登录白名单" desc="仅允许这些IP登录" variant="vertical">
      <XTextarea v-model="form.ip" placeholder="每行仅限一个IP" rows="4" />
    </FormField>

    <FormField label="备注" desc="备注信息" variant="vertical">
      <XTextarea v-model="form.comments" placeholder="备注" />
    </FormField>

    <FormField
      label="隐藏服务显示"
      desc="开启后, 该用户可以查看并提交隐藏服务"
      :content-flex="false"
    >
      <XSwitch v-model="form.showHiddenService" />
    </FormField>

    <FormField
      label="ApiKey状态"
      desc="关闭后, 用户无法查看ApiKey"
      :content-flex="false"
    >
      <XSwitch v-model="form.showApi" />
    </FormField>

    <FormField
      label="心跳检测"
      desc="关闭后, 用户前台不做心跳检测"
      :content-flex="false"
    >
      <XSwitch v-model="form.heartbeatEnabled" />
    </FormField>
    
    <FormField
      label="网站管理员"
      desc="开启后，用户可以登录网站后台"
      :content-flex="false"
    >
      <XSwitch v-model="form.role" :active-value="1" :inactive-value="0" />
    </FormField>

    <FormField
      label="经销商"
      desc="开启后，用户可以登录经销商后台"
      :content-flex="false"
    >
      <XSwitch v-model="form.userType" />
    </FormField>

    <FormField
      label="开通 API"
      desc="开启后，用户可以使用 API 提交订单"
      :content-flex="false"
    >
      <XSwitch v-model="form.allowApi" />
    </FormField>

    <FormField
      label="推送消息"
      desc="开启后，用户可以收到公众号推送消息"
      :content-flex="false"
    >
      <XSwitch v-model="form.pushMsg" />
    </FormField>

    <FormField
      label="允许欠费"
      desc="开启后，用户可以欠费使用"
      :content-flex="false"
    >
      <XSwitch v-model="form.allowNegativeCredits" />
    </FormField>

    <FormField
      label="禁用"
      desc="开启后，用户无法登录、无法使用"
      :content-flex="false"
    >
      <XSwitch v-model="form.disableUser" />
    </FormField>
  </form>
</template>
