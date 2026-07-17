import type { IllustrateItem } from '@/inters/illustrate'
import { XButton, type XColDef } from '@3un/ui'
import { xconfirm } from '@3un/utils'
import { h } from 'vue'
import { toast } from 'vue-sonner'
import { DOCX_STORE } from '.'

export const columns: XColDef<IllustrateItem> = [
  {
    key: 'id',
    title: 'ID',
    width: 88,
  },
  {
    key: 'serviceCode',
    title: '说明文档模块',
    width: 128,
  },
  {
    key: 'description',
    title: '说明文档描述',
    width: 188,
    cellEmpty: "暂无描述",
    render(value) {
      return value ? value : '暂无描述'
    }
  },
  {
    key: 'serviceDesc',
    title: '文档预览',
    width: 88,
    render(value) {
      function handleClick() {
        if (!value) {
          toast.warning('该模块暂无文本')
          return
        }
        xconfirm(value)
      }
      return h(XButton, {
        size: 'sm',
        label: '效果预览',
        onClick: handleClick
      })
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    width: 128,
  },
  {
    key: 'updateTime',
    title: '最新更新时间',
    width: 128
  },
  {
    key: 'action',
    title: '操作',
    width: 88,
    render(_, __, index) {
      const store = inject(DOCX_STORE)!

      function handleClick() {
        store.index = index
        store.visibleImage = true
      }

      return h(XButton, {
        size: 'sm',
        label: '图片预览',
        onClick: handleClick
      })
    }
  },
]