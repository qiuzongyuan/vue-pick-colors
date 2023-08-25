export const hsv2hsl = (h: number, s: number, v: number) => {
  return [
    h,
    (s * v) / ((h = (2 - s) * v) < 1 ? h : 2 - h) || 0,
    h / 2
  ]
}

const INT_HEX_MAP = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' }

const hexOne = (value: number) => {
  value = Math.min(Math.round(value), 255)
  const high = Math.floor(value / 16)
  const low = value % 16
  return `${INT_HEX_MAP[high] || high}${INT_HEX_MAP[low] || low}`
}

export const rgb2hex = ({ r, g, b }) => {
  if (isNaN(r) || isNaN(g) || isNaN(b)) return ''

  return `#${hexOne(r)}${hexOne(g)}${hexOne(b)}`
}

const isOnePointZero = (n: unknown) => {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1
}

const isPercentage = (n: unknown) => {
  return typeof n === 'string' && n.indexOf('%') !== -1
}

const bound01 = (value: number | string, max: number | string) => {
  if (isOnePointZero(value)) value = '100%'

  const processPercent = isPercentage(value)
  value = Math.min(max as number, Math.max(0, parseFloat(`${value}`)))

  // Automatically convert percentage into number
  if (processPercent) {
    value = parseInt(`${value * (max as number)}`, 10) / 100
  }

  // Handle floating point rounding errors
  if (Math.abs(value - (max as number)) < 0.000001) {
    return 1
  }

  // Convert into [0, 1] range if it isn't already
  return (value % (max as number)) / parseFloat(max as string)
}

export const hsv2rgb = (h, s, v) => {
  h = bound01(h, 360) * 6
  s = bound01(s, 100)
  v = bound01(v, 100)

  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const mod = i % 6
  const r = [v, q, p, p, t, v][mod]
  const g = [t, v, v, q, p, p][mod]
  const b = [p, p, t, v, v, q][mod]

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export const hsvFormat = ({ h, s, v, a }, format, useAlpha = true) => {
  if (useAlpha) {
    switch (format) {
      case 'hsl': {
        const hsl = hsv2hsl(h, s / 100, v / 100)
        return `hsla(${(h).toFixed(0)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, ${a})`
      }
      case 'rgb': {
        const { r, g, b } = hsv2rgb(h, s, v)
        return `rgba(${r}, ${g}, ${b}, ${a})`
      }
      case 'hex':
      default:
        return `${rgb2hex(hsv2rgb(h, s, v))}${hexOne(a * 255)}`
    }
  } else {
    switch (format) {
      case 'hsl': {
        const hsl = hsv2hsl(h, s / 100, v / 100)
        return `hsl(${(h).toFixed(0)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
      }
      case 'rgb': {
        const { r, g, b } = hsv2rgb(h, s, v)
        return `rgb(${r}, ${g}, ${b})`
      }
      case 'hex':
      default :
        return rgb2hex(hsv2rgb(h, s, v))
    }
  }
}

export const rgb2hsv = ({ r, g, b }) => {
  r = bound01(r, 255)
  g = bound01(g, 255)
  b = bound01(b, 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  const v = max

  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      }
      case g: {
        h = (b - r) / d + 2
        break
      }
      case b: {
        h = (r - g) / d + 4
        break
      }
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, v: v * 100 }
}

export const hsl2hsv = ({ h, s, l }) => {
  s = s / 100
  l = l / 100
  let smin = s
  const lmin = Math.max(l, 0.01)

  l *= 2
  s *= l <= 1 ? l : 2 - l
  smin *= lmin <= 1 ? lmin : 2 - lmin
  const v = (l + s) / 2
  const sv =
    l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)

  return {
    h: +h,
    s: sv * 100,
    v: v * 100
  }
}

export const hex2rgb = (hex: string) => {
  const temp = [] as number []
  if (hex.match(/^#([0-9a-fA-f]{3,4})$/g)) {
    for (let i = 1; i < hex.length; i++) {
      temp.push(parseInt('0x' + hex[i].repeat(2)))
    }
  } else if (hex.match(/^#([0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/g)) {
    for (let i = 1; i < hex.length; i = i + 2) {
      temp.push(parseInt('0x' + hex.slice(i, i + 2)))
    }
  }
  const [r, g, b, a] = temp
  return {
    r,
    g,
    b,
    a
  }
}

const pickUpRgb = (rgb:string) => {
  const [r, g, b, a] = rgb.match(/(\d(\.\d+)?)+/g)
  return {
    r,
    g,
    b,
    a
  }
}

const pickUpHsl = (hsla: string) => {
  const [h, s, l, a] = hsla.match(/(\d(\.\d+)?)+/g)
  return {
    h,
    s: parseFloat(s),
    l: parseFloat(l),
    a
  }
}

export const transformHsva = (color: string, format, useAlpha = true) => {
  if (useAlpha) {
    switch (format) {
      case 'hex': {
        const { r, g, b, a } = hex2rgb(color)
        return { ...rgb2hsv({ r, g, b }), a: a / 255 }
      }
      case 'rgb': {
        const { r, g, b, a } = pickUpRgb(color)
        return { ...rgb2hsv({ r, g, b }), a: +a }
      }
      case 'hsl': {
        const { h, s, l, a } = pickUpHsl(color)
        return { ...hsl2hsv({ h, s, l }), a: +a }
      }
    }
  } else {
    switch (format) {
      case 'hex':
        return { ...rgb2hsv(hex2rgb(color)), a: 1 }
      case 'rgb': {
        return { ...rgb2hsv(pickUpRgb(color)), a: 1 }
      }
      case 'hsl': {
        return { ...hsl2hsv(pickUpHsl(color)), a: 1 }
      }
    }
  }
}

// export const checkColor = (color: string, format, useAlpha = true) => {
//   if (useAlpha) {
//     switch (format) {
//       case 'hex':
//         return color.match(/^#([0-9a-fA-F]{8})$/g)
//       case 'rgb':
//         return color.match(/^rgba\((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(0\.\d{1,2}|1|0)\)/g)
//       case 'hsl':
//         return color.match(/^hsla\((((([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360).[0-9]?[0-9])|(([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360)),(\s*)([0-9]?[0-9]|100)%,(\s*)([0-9]?[0-9]|100)%,(\s*)(0\.\d{1,2}|1|0)\)/g)
//     }
//   } else {
//     switch (format) {
//       case 'hex':
//         return color.match(/^#([0-9a-fA-F]{6})$/g)
//       case 'rgb':
//         return color.match(/^rgb\((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\)/g)
//       case 'hsl':
//         return color.match(/^hsl\((((([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360).[0-9]?[0-9])|(([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360)),(\s*)([0-9]?[0-9]|100)%,(\s*)([0-9]?[0-9]|100)%\)/g)
//     }
//   }
// }

export const checkColorValue = (color: string, format) => {
  switch (format) {
    case 'hex':
      return color.match(/^#([0-9a-fA-f]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/g)
      // return color.match(/^#([0-9a-fA-F]{6})$/g)
    case 'rgb':
      return color.match(/^rgb(\((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\)|(a\((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),(\s*)(0\.\d{1,2}|1|0)\)))/g)
    case 'hsl':
      return color.match(/^hsl(\((((([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360).[0-9]?[0-9])|(([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360)),(\s*)([0-9]?[0-9]|100)%,(\s*)([0-9]?[0-9]|100)%\)|a\((((([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360).[0-9]?[0-9])|(([0-9]|([1-9][0-9])|([0-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))|360)),(\s*)([0-9]?[0-9]|100)%,(\s*)([0-9]?[0-9]|100)%,(\s*)(0\.\d{1,2}|1|0)\))/g)
  }
}

export const checkColorFormat = (color: string) => {
  if (color.match(/^#/)) return 'hex'
  if (color.match(/^rgb/)) return 'rgb'
  if (color.match(/^hsl/)) return 'hsl'
  return undefined
}

export const filterHsva = ({ h, s, v, a }: { h: number, s:number, v:number, a: number }) => {
  if (isNaN(h)) h = 0
  if (isNaN(s)) s = 0
  if (isNaN(v)) v = 0
  if (isNaN(a)) a = 1
  return { h, s, v, a }
}

export function debounce (fn, delay = 100) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

export const popperOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 5]
      }
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration: false,
        adaptive: false
      }
    }
  ]
}
