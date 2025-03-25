<template>
  <div>
    <svg :width="width" :height="height">
      <!-- 1. 椭圆背景 -->
      <ellipse
        v-for="(level, index) in ellipseLevels"
        :key="'ellipse-' + index"
        :cx="cx"
        :cy="cy"
        :rx="level * rx"
        :ry="level * ry"
        stroke="#D3D3D3"
        stroke-width="1"
        fill="none"
      />
      <!-- 2. 辐条 -->
      <line
        v-for="(spoke, index) in spokes"
        :key="'spoke-' + index"
        :x1="cx"
        :y1="cy"
        :x2="spoke.x2"
        :y2="spoke.y2"
        stroke="#D3D3D3"
        stroke-width="1"
      />
      <!-- 3. 数据区域的星形多边形 -->
      <polygon :points="starPoints" fill="#808080" stroke="none" />
      <!-- 4. 维度标签和百分比 -->
      <text
        v-for="(label, index) in labels"
        :key="'label-' + index"
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="12"
        fill="black"
      >
        {{ label.text }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义 props
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
    validator: value =>
      value.every(
        item =>
          typeof item.label === 'string' &&
          typeof item.value === 'number' &&
          item.value >= 0 &&
          item.value <= 100
      )
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  },
  levels: {
    type: Number,
    default: 4
  }
})

// 中心点坐标
const cx = props.width / 2
const cy = props.height / 2

// 椭圆的最大半径（留出标签空间）
const padding = 50
const rx = (props.width - 2 * padding) / 2
const ry = (props.height - 2 * padding) / 2

// 计算维度数量和角度
const N = props.data.length
const angles = Array.from({ length: N }, (_, i) => i * (2 * Math.PI / N))

// 1. 同心椭圆级别
const ellipseLevels = Array.from(
  { length: props.levels },
  (_, i) => (i + 1) / props.levels
)

// 2. 辐条坐标
const spokes = angles.map((angle) => ({
  x2: cx + rx * Math.sin(angle),
  y2: cy - ry * Math.cos(angle)
}))

// 3. 数据点坐标
const dataPoints = props.data.map((item, i) => {
  const angle = angles[i]
  const x = cx + (item.value / 100) * rx * Math.sin(angle)
  const y = cy - (item.value / 100) * ry * Math.cos(angle)
  return { x, y }
})

// 4. 生成星形连接顺序
const getStarOrder = (n) => {
  if (n < 3) return [];
  const order = [];
  const step = n % 2 === 0 ? 2 : Math.floor(n / 2); // 偶数用 step = 2，奇数用 floor(n/2)
  let current = 0;
  do {
    order.push(current);
    current = (current + step) % n;
  } while (current !== 0 && order.length < n);
  return order;
};

// 5. 星形多边形的点
const starPoints = computed(() => {
  const order = getStarOrder(N)
  return order.map(index => `${dataPoints[index].x},${dataPoints[index].y}`).join(' ')
})

// 6. 标签位置和文本
const labels = props.data.map((item, i) => {
  const angle = angles[i]
  const labelX = cx + 1.1 * rx * Math.sin(angle)
  const labelY = cy - 1.1 * ry * Math.cos(angle)
  return {
    x: labelX,
    y: labelY,
    text: `${item.label} ${item.value}%`
  }
})
</script>
