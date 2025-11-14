import type { DeviceCategory, ProductItem } from './types'

export const deviceCategorys: DeviceCategory[] = [
  {
    id: 0,
    name: '全部产品',
  },
  {
    id: 1,
    name: '手机',
  },
  {
    id: 2,
    name: '手表',
  },
  {
    id: 3,
    name: '配件',
  },
]

export const products: ProductItem[] = [
  {
    id: 1,
    category: 1,
    name: 'iPhone 16 Pro',
    price: 7999,
    originalPrice: 8999,
    image: 'https://www.apple.com/v/iphone-16/f/images/specs/finish_iphone_plus__b9g0ud5kzwty_large_2x.jpg',
    colors: ['沙漠钛金属', '原色钛金属', '白色钛金属', '黑色钛金属'],
    storage: ['128GB', '256GB', '512GB', '1TB'],
    features: ['A18 Pro芯片', '专业级摄像头系统', '钛金属设计', '相机控制', '4K 120fps 杜比视界'],
    description: '搭载A18 Pro芯片的iPhone 16 Pro，拥有强大的性能和专业级的摄像头系统，支持Apple Intelligence。',
    specs: {
      display: '6.3英寸 超视网膜XDR显示屏',
      camera: '48MP 融合摄像头，5倍长焦摄像头',
      chip: 'A18 Pro芯片',
      battery: '视频播放时间最长可达27小时'
    }
  },
  {
    id: 3,
    category: 1,
    name: 'iPhone 16',
    price: 5999,
    originalPrice: 6999,
    image: 'https://www.apple.com/v/iphone-16/f/images/specs/finish_iphone__e19m74d9ehaq_large_2x.jpg',
    colors: ['群青色', '深青色', '粉色', '白色', '黑色'],
    storage: ['128GB', '256GB', '512GB'],
    features: ['A18芯片', '48MP 融合摄像头', '相机控制', 'USB-C接口', 'Apple Intelligence'],
    description: '全新的iPhone 16，搭载A18芯片，拥有先进的摄像头系统和Apple Intelligence。',
    specs: {
      display: '6.1英寸 超视网膜XDR显示屏',
      camera: '48MP 融合摄像头，超广角摄像头',
      chip: 'A18芯片',
      battery: '视频播放时间最长可达22小时'
    }
  },
  {
    id: 4,
    category: 1,
    name: 'iPhone 16 Plus',
    price: 6999,
    originalPrice: 7999,
    image: 'https://www.apple.com/v/iphone-16/f/images/overview/contrast/iphone_16__flbknhdndb22_xlarge_2x.jpg',
    colors: ['群青色', '深青色', '粉色', '白色', '黑色'],
    storage: ['128GB', '256GB', '512GB'],
    features: ['A18芯片', '48MP 融合摄像头', '相机控制', 'USB-C接口', 'Apple Intelligence'],
    description: '更大屏幕的iPhone 16 Plus，提供更长的电池续航时间。',
    specs: {
      display: '6.7英寸 超视网膜XDR显示屏',
      camera: '48MP 融合摄像头，超广角摄像头',
      chip: 'A18芯片',
      battery: '视频播放时间最长可达27小时'
    }
  },
  {
    id: 5,
    category: 1,
    name: 'iPhone 15',
    price: 5499,
    originalPrice: 6299,
    image: 'https://www.apple.com/v/iphone-15/d/images/specs/finish_iphone__bvnqblbns6r6_large_2x.jpg',
    colors: ['粉色', '黄色', '绿色', '蓝色', '黑色'],
    storage: ['128GB', '256GB', '512GB'],
    features: ['A16仿生芯片', '48MP 主摄像头', '灵动岛', 'USB-C接口'],
    description: '全新的iPhone 15，搭载A16仿生芯片，拥有出色的摄像头系统。',
    specs: {
      display: '6.1英寸 超视网膜XDR显示屏',
      camera: '48MP 主摄像头',
      chip: 'A16仿生芯片',
      battery: '视频播放时间最长可达20小时'
    }
  },
  {
    id: 6,
    category: 1,
    name: 'iPhone SE',
    price: 3299,
    originalPrice: 3999,
    image: 'https://www.apple.com/v/iphone/compare/ai/images/overview/all_models_iphoneSE_2nd_gen__dk17c483cy2q_large_2x.jpg',
    colors: ['午夜色', '星光色', '红色'],
    storage: ['64GB', '128GB', '256GB'],
    features: ['A15仿生芯片', '12MP 摄像头', '4.7英寸显示屏', 'Touch ID'],
    description: '小巧强大的iPhone SE，搭载A15仿生芯片，性价比之选。',
    specs: {
      display: '4.7英寸 视网膜高清显示屏',
      camera: '12MP 摄像头',
      chip: 'A15仿生芯片',
      battery: '视频播放时间最长可达15小时'
    }
  },
  {
    id: 7,
    category: 2,
    name: 'Apple Watch Series 10',
    price: 2999,
    originalPrice: 3299,
    image: 'https://www.apple.com/v/watch/compare/ag/images/overview/all_models_watch_series_10__cbcya4xwu1py_large_2x.jpg',
    colors: ['玫瑰金', '银色', '炭黑色', '原色钛金属', '金色钛金属', '深空钛金属'],
    storage: ['42mm', '46mm'],
    features: ['S10芯片', '最大最先进的显示屏', '睡眠呼吸暂停通知', '快速充电', '深度传感器'],
    description: '有史以来最纤薄的Apple Watch，拥有最大最先进的显示屏和丰富的健康功能。',
    specs: {
      display: '最大最先进的显示屏，广角OLED',
      sensors: '心电图、血氧、温度传感器',
      battery: '全天18小时使用，低功耗模式36小时',
      durability: '50米防水，IP6X防尘'
    }
  },
  {
    id: 8,
    category: 2,
    name: 'Apple Watch Ultra 2',
    price: 6299,
    originalPrice: 6999,
    image: 'https://www.apple.com/v/watch/compare/ag/images/overview/all_models_watch_ultra_2__two5m8hr0yym_large_2x.jpg',
    colors: ['原色钛金属', '黑色钛金属'],
    storage: ['49mm'],
    features: ['S9芯片', '钛金属表壳', '100米防水', '双频GPS', '操作按钮'],
    description: '终极运动和探险手表，专为极限运动和户外探险设计。',
    specs: {
      display: '49mm 始终显示视网膜显示屏，最高3000尼特',
      sensors: '心电图、血氧、温度传感器',
      battery: '正常使用36小时，低功耗模式72小时',
      durability: '100米防水，可用于水上运动和水肺潜水'
    }
  },
  {
    id: 9,
    category: 2,
    name: 'Apple Watch SE',
    price: 1899,
    originalPrice: 2299,
    image: 'https://www.apple.com/v/watch/compare/ag/images/overview/all_models_watch_se_gen2__e003vtroucgi_large_2x.jpg',
    colors: ['银色', '午夜色', '星光色'],
    storage: ['40mm', '44mm'],
    features: ['S8芯片', '视网膜显示屏', '心率监测', '跌倒检测', '车祸检测'],
    description: '具备核心功能的Apple Watch，价格亲民，适合健身和日常使用。',
    specs: {
      display: '视网膜显示屏，最高1000尼特',
      sensors: '心率传感器、加速度传感器',
      battery: '全天18小时使用',
      durability: '50米防水'
    }
  },
  {
    id: 10,
    category: 3,
    name: 'MagSafe 充电器',
    price: 299,
    originalPrice: 329,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1699475147884',
    colors: ['银色'],
    storage: [],
    features: ['支持 MagSafe 快速无线充电', '兼容所有支持 Qi 的设备', '磁力对准 iPhone'],
    description: 'MagSafe 充电器能为兼容 iPhone 提供更快速、便捷的无线充电体验。',
    specs: {
      compatibility: '支持 iPhone 12 及更新机型',
      power: '15W 快速充电',
      connector: 'USB-C',
      cable: '1 米充电线'
    }
  },
  {
    id: 11,
    category: 3,
    name: '20W USB-C 电源适配器',
    price: 129,
    originalPrice: 149,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHJA3?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1599511807000',
    colors: ['白色'],
    storage: [],
    features: ['20W 高效充电', '适用于 iPhone、iPad', '便携设计'],
    description: '适配器可为所有支持 USB-C 的设备提供高效快速充电，配合 iPhone 8 及后续机型实现快速充电。',
    specs: {
      output: '20W',
      port: 'USB-C',
      compatibility: 'iPhone、iPad、AirPods 等',
      dimensions: '41mm × 43mm × 26mm'
    }
  },
  {
    id: 12,
    category: 3,
    name: 'AirPods Pro (第 2 代)',
    price: 1899,
    originalPrice: 1999,
    image: 'https://www.apple.com/autopush/ww/search/modules/airpodspro2/image__d28ykuoxnouq_large_2x.jpg',
    colors: ['白色'],
    storage: [],
    features: ['主动降噪', '自适应通透模式', '支持空间音频', '配备 MagSafe 充电盒'],
    description: '搭载 H2 芯片的 AirPods Pro（第 2 代），带来震撼音效与降噪体验。',
    specs: {
      chip: 'H2 音频芯片',
      battery: '单次充电最长 6 小时，充电盒共可提供 30 小时',
      audio: '主动降噪、通透模式、空间音频',
      charging: '支持 MagSafe / Lightning / USB-C / Qi'
    }
  },
  {
    id: 13,
    category: 3,
    name: 'USB-C 转 Lightning 数据线（1 米）',
    price: 135,
    originalPrice: 145,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX0K2?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1591634795000',
    colors: ['白色'],
    storage: [],
    features: ['快速数据传输', '兼容 USB-C 充电器', '支持 iPhone 和 iPad'],
    description: '使用这款 USB-C 转 Lightning 数据线可连接你的 iPhone、iPad 或 iPod，用于同步与充电。',
    specs: {
      length: '1 米',
      interface: 'USB-C to Lightning',
      compatibility: 'iPhone、iPad、AirPods、Mac',
      material: '柔韧耐用 PVC'
    }
  },
  {
    id: 14,
    category: 3,
    name: 'iPhone 16 Pro 硅胶保护壳（配 MagSafe）',
    price: 379,
    originalPrice: 399,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT2L3?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1693433989327',
    colors: ['午夜蓝', '鼠尾草绿', '粉沙色', '黑色'],
    storage: [],
    features: ['与 MagSafe 兼容', '柔软触感', '精准贴合 iPhone 16 Pro'],
    description: 'Apple 设计的硅胶保护壳贴合 iPhone 16 Pro，提供出色保护与时尚外观。',
    specs: {
      material: '高性能液态硅胶',
      compatibility: '仅适用于 iPhone 16 Pro',
      magSafe: '支持',
      weight: '约 30 克'
    }
  },
]
