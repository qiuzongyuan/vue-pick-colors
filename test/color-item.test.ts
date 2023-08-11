import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import ColorItem from '../src/color-item'

describe('color item', () => {
  it('size', () => {
    const size = 26
    const wrapper = mount(ColorItem, {
      props: {
        size
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.width).toBe(`${size}px`)
    expect(element.style.height).toBe(`${size}px`)
  })
  it('border', () => {
    const wrapper = mount(ColorItem, {
      props: {
        border: false
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.border).toBe('')
  })

  it('value', async () => {
    const value = '#333333'
    const wrapper = mount(ColorItem, {
      props: {
        value
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.getContext('2d')?.fillStyle).toBe(value)
    const changeValue = '#ffffff'
    wrapper.setProps({ value: changeValue })
    await wrapper.vm.$nextTick()
    expect(element.getContext('2d')?.fillStyle).toBe(changeValue)
  })

  it('borderRadius', () => {
    const borderRadius = 10
    const wrapper = mount(ColorItem, {
      props: {
        borderRadius
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.borderRadius).toBe(`${borderRadius}px`)
  })

  it('theme', () => {
    const wrapper = mount(ColorItem, {
      global: {
        provide: {
          theme: {
            theme: 'dark'
          }
        }
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.border).toContain('#434345')
  })

  it('selected', () => {
    const wrapper = mount(ColorItem, {
      props: {
        selected: true
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.boxShadow).toContain('#1890ff')
  })

  it('selected and dark theme', () => {
    const wrapper = mount(ColorItem, {
      props: {
        selected: true
      },
      global: {
        provide: {
          theme: {
            theme: 'dark'
          }
        }
      }
    })
    const element = wrapper.find('.color-item').element as HTMLCanvasElement
    expect(element.style.boxShadow).toContain('#2681ff')
  })
})
