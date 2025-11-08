/** iphone新机的状态 */ 
const NEW_IPHONE_STATUS = ['新机','资源机','CPO','备注']

/** 国产手机 */ 
const CHINA_STATUS = ['新机','资源机']

/** 报价个性化的颜色 */ 
const QUOTE_FILLTER_COLOR = [
  {
    name: 'quote.QuoteFilter.Color.black',
    class: 'bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% shadow-black dark:shadow-white'
  },
  {
    name: 'quote.QuoteFilter.Color.yellow',
    class: 'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/20 to-80% shadow-yellow-500'
  },
  {
    name: 'quote.QuoteFilter.Color.green',
    class: 'bg-gradient-to-br from-green-500/80 from-30% to-green-500/20 to-80% shadow-green-500'
  },
  {
    name: 'quote.QuoteFilter.Color.sky',
    class: 'bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80% shadow-blue-500'
  },
  {
    name: 'quote.QuoteFilter.Color.orange',
    class: 'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/20 to-80% shadow-orange-500'
  },
  {
    name: 'quote.QuoteFilter.Color.red',
    class: 'bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80% shadow-red-500'
  }
]
//
/** 所有报价单 */ 
const ALL_QUOTATION =[
  'quote.RealQuote.FarVision',
  'quote.RealQuote.Flying',
  'quote.RealQuote.HongKong',
  'quote.RealQuote.Other'
]

//颜色相关的枚举
export enum ColorEnum {
    BLACK = 1,
    WHITE = 2,
    BLUE = 3,
    PURPLE = 4,
    GREEN = 5,
    SILVER = 6,
    ORANGE = 7,
    PINK = 8,
    ULTRAMARINE = 9,
    TEAL = 10,
    DESERT = 11,
    PRIMARY_COLOR = 12,
    YELLOW = 13,
    RED = 14,
}
// 获取颜色名称的映射（反向映射）
export const ColorEnumNames = {
    [ColorEnum.BLACK]: 'quote.Colors.Color1',
    [ColorEnum.WHITE]: 'quote.Colors.Color2',
    [ColorEnum.BLUE]: 'quote.Colors.Color3',
    [ColorEnum.PURPLE]: 'quote.Colors.Color4',
    [ColorEnum.GREEN]: 'quote.Colors.Color5',
    [ColorEnum.SILVER]: 'quote.Colors.Color6',
    [ColorEnum.ORANGE]: 'quote.Colors.Color7',
    [ColorEnum.PINK]: 'quote.Colors.Color8',
    [ColorEnum.ULTRAMARINE]: 'quote.Colors.Color9',
    [ColorEnum.TEAL]: 'quote.Colors.Color10',
    [ColorEnum.DESERT]: 'quote.Colors.Color11',
    [ColorEnum.PRIMARY_COLOR]: 'quote.Colors.Color12',
    [ColorEnum.YELLOW]: 'quote.Colors.Color13',
    [ColorEnum.RED]: 'quote.Colors.Color14',
} as { [key: number]: string }


// 对应中文映射
export const ConditionNames: Record<number, string> = {
  1: "quote.TableHeaders1.Header2",
  2: "quote.TableHeaders1.Header3",
  3: "quote.TableHeaders1.Header4",
  4: "quote.TableHeaders1.Header5"
}

export {
  NEW_IPHONE_STATUS,
  CHINA_STATUS,
  QUOTE_FILLTER_COLOR,
  ALL_QUOTATION,
}