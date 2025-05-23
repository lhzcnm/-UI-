import type { Intercept } from '@/inters/intercept'
import type { XColDef } from '@3un/ui'

export const columns: XColDef<Intercept> = [
  {
    key: 'id',
    title: '拦截ID',
    width: 72,
  },
  {
    key: 'ip',
    title: '拦截IP',
    width: 128,
  },
  {
    key: 'createTime',
    title: '创建时间',
    width: 180,
  },
  {
    key: 'expireTime',
    title: '过期时间',
    width: 180,
  },
  {
    key: 'comments',
    title: '备注',
    minWidth: 280,
  },
]
