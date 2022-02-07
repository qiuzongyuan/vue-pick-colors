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
        return `hsla(${h}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, ${a})`
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
        return `hsl(${h}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
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
  const rgbArr = []
  for (let i = 1; i < hex.length; i = i + 2) {
    rgbArr.push(parseInt('0x' + hex.slice(i, i + 2)))
  }
  const [r, g, b] = rgbArr
  return {
    r,
    g,
    b
  }
}

export const hex2rgba = (hex: string) => {
  const temp = []
  for (let i = 1; i < hex.length; i = i + 2) {
    temp.push(parseInt('0x' + hex.slice(i, i + 2)))
  }
  const [r, g, b, a] = temp
  return {
    r,
    g,
    b,
    a
  }
}

const splitStr = (str: string, start: number, end: number) => {
  str = str.slice(start, end)
  return str.split(',')
}

const pickUpRgba = (rgba:string) => {
  const [r, g, b, a] = splitStr(rgba, 5, rgba.length - 1)
  return {
    r,
    g,
    b,
    a
  }
}

const pickUpRgb = (rgb:string) => {
  const [r, g, b] = splitStr(rgb, 4, rgb.length - 1)
  return {
    r,
    g,
    b
  }
}

const pickUpHsla = (hsla: string) => {
  const [h, s, l, a] = splitStr(hsla, 5, hsla.length - 1)
  return {
    h,
    s: parseFloat(s),
    l: parseFloat(l),
    a
  }
}

const pickUpHsl = (hsla: string) => {
  const [h, s, l] = splitStr(hsla, 4, hsla.length)
  return {
    h,
    s,
    l
  }
}

export const transformHsv = (color: string, format, useAlpha = true) => {
  if (useAlpha) {
    switch (format) {
      case 'hex': {
        const { r, g, b, a } = hex2rgba(color)
        return { ...rgb2hsv({ r, g, b }), a: +(a / 255).toFixed(2) }
      }
      case 'rgb': {
        const { r, g, b, a } = pickUpRgba(color)
        return { ...rgb2hsv({ r, g, b }), a: +a }
      }
      case 'hsl': {
        const { h, s, l, a } = pickUpHsla(color)
        return { ...hsl2hsv({ h, s, l }), a: +a }
      }
    }
  } else {
    switch (format) {
      case 'hex':
        return rgb2hsv(hex2rgb(color))
      case 'rgb': {
        return rgb2hsv(pickUpRgb(color))
      }
      case 'hsl': {
        return hsl2hsv(pickUpHsl(color))
      }
    }
  }
}
