import type { XColDef } from '@3un/ui'
import type { Log } from '@/inters/logs'

export const columns: XColDef<Log> = [
  {
    key: 'id',
    title: '日志ID',
    width: 72,
  },
  {
    key: 'userId',
    title: '用户ID',
    width: 72,
  },
  {
    key: 'ip',
    title: 'IP地址',
    width: 160,
  },
  {
    key: 'region',
    title: '地区',
    width: 200,
  },
  {
    key: 'loginTime',
    title: '登录时间',
    width: 160,
  },
  {
    key: 'logoutTime',
    title: '登出时间',
    width: 160,
  },
]
