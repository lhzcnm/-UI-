import { zActivity, type Activity, type ActivityCreate, type ActivitySearch, type ActivityUpdate } from '@/inters/activity'
import { zActivyRecharge, type ActivyRechargeList } from '@/inters/activity/recharge'
import { zActivityRule, type ActivityRule, type ActivityRuleCreate, type ActivityRuleUpdate } from '@/inters/activity/rule'
import type { RechargeListParams } from '@/inters/recharge'
import http from '@/utils/http'

type ActivityListFn = (body: ActivitySearch) => Promise<Activity[]>
export const getActivitys: ActivityListFn = async (body) => {
  const { data } = await http.post<Activity[]>("/Activity/list", body)
  return data.map(item => zActivity.parse(item))
}

type ActivityCreateFn = (body: ActivityCreate) => Promise<void>
export const createActivity: ActivityCreateFn = async (body) => {
  await http.post("/Activity/add", body)
}

type ActivityUpdateFn = (body: ActivityUpdate) => Promise<void>
export const updateActivity: ActivityUpdateFn = async (body) => {
  await http.put("/Activity/update", body)
}

type ActivityDelateFn = (id: number) => Promise<void>
export const deleteActivity: ActivityDelateFn = async (id) => {
  await http.delete(`/Activity/${id}`)
}

type ActivityRuleListFn = (activityId: number) => Promise<ActivityRule[]>
export const getActivityRule: ActivityRuleListFn = async (activityId) => {
  const { data } = await http.get<ActivityRule[]>("/activity/rule/list", { params: { activityId } })
  return data.map(item => zActivityRule.parse(item))
}

type ActivityRuleCreateFn = (body: ActivityRuleCreate) => Promise<ActivityRule>
export const createActivityRule: ActivityRuleCreateFn = async (body) => {
  const { data } = await http.post<ActivityRule>("/activity/rule/add", body)
  return zActivityRule.parse(data)
}

type ActivityRuleUpdateFn = (body: ActivityRuleUpdate) => Promise<ActivityRule>
export const updateActivityRule: ActivityRuleUpdateFn = async (body) => {
  const { data } = await http.post<ActivityRule>("/activity/rule/update", body)
  return zActivityRule.parse(data)
}

type ActivityRuleDeleteFn = (id: number) => Promise<void>
export const deleteActivityRule: ActivityRuleDeleteFn = async (id) => {
  await http.delete(`/activity/rule/delete/${id}`)
}

type RechargeActivityListFn = (body: RechargeListParams) => Promise<ActivyRechargeList>
export const getActivyRecharges: RechargeActivityListFn = async (body) => {
  const { data } = await http.post<ActivyRechargeList>('payment/list/activities', body)
  return { ...data, list: data.list.map(item => zActivyRecharge.parse(item)) }
}
