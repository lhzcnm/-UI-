import type { Activity, ActivityCreate, ActivitySearch } from '@/inters/activity'
import type { ActivyRecharge, ActivyRechargeList } from '@/inters/activity/recharge'
import type { ActivityRule, ActivityRuleUpdate } from '@/inters/activity/rule'
import type { RechargeSearchForm } from '@/inters/recharge'
import type { ActivityVoucherCreate } from '@/inters/voucher/activity'
import type { IK } from '@3un/shared'

export const ACTIVITY_STORE: IK<ActivityStore> = Symbol('activity')
export const ACTIVITY_RECHARGE_STORE: IK<ActivityRecharge> = Symbol('activity-recharge')

export interface ActivityStore {
  visibleBase: boolean,
  visibleSearch: boolean,
  visibleRule: boolean,

  activities: Activity[],
  formSearch: ActivitySearch,
  formBase: ActivityCreate,

  activityRules: ActivityRule[],
  activityRuleForms: ActivityRuleUpdate[],

  refresh: boolean,
  index: number | undefined,
}

export interface ActivityRecharge {
  visibleCreate: boolean,
  visibleSearch: boolean,

  activityId: number,

  formSearch: RechargeSearchForm,

  activityMap: Map<number, Activity>,

  formCreate: ActivityVoucherCreate,
  recharges: ActivyRechargeList,
  payment: ActivyRecharge,

  refresh: boolean,
  page: number,
  limit: number,
}
