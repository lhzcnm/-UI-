import { XTag } from "@3un/ui"
import { ORDER_STATUS, ORDER_STATUS_MAP } from "@3un/utils"
import { h } from "vue"

export function getDefaultColumns(t: (str: string) => string) {
  return [
    {
      key: "imei",
      title: "IMEI",
      width: 128,
    },
    {
      key: "status",
      title: "状态",
      width: 88,
      render: (value: ORDER_STATUS) => {
        const status = ORDER_STATUS_MAP[value]

        return h(XTag, {
          label: t(status.key!),
          color: status.color,
        })
      }
    }
  ]
}
