export type Theme = 'light' | 'dark'
export type Format = 'rgb' | 'hex' | 'hsl'
export const defaultModifiers = [
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
