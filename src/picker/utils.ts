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

export const formatColor = ({ h, s, v, a }, format, useAlpha = true) => {
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
