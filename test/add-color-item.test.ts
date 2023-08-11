import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import AddColorItem from '../src/add-color-item'

describe('add color item', () => {
  it('size', () => {
    const size = 26
    const wrapper = mount(AddColorItem, {
      props: {
        size
      }
    })
    const element = wrapper.find('.add-color-item').element as HTMLCanvasElement
    expect(element.style.width).toBe(`${size}px`)
    expect(element.style.height).toBe(`${size}px`)
  })

  it('selected', async () => {
    const wrapper = mount(AddColorItem, {
      props: {
        selected: true
      }
    })
    await wrapper.vm.$nextTick()
    const element = wrapper.find('.add-color-item').element as HTMLCanvasElement
    expect(element.style.boxShadow).toContain('#1890ff')
  })

  it('dark theme and selected', async () => {
    const wrapper = mount(AddColorItem, {
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
    await wrapper.vm.$nextTick()
    const element = wrapper.find('.add-color-item').element as HTMLCanvasElement
    expect(element.style.boxShadow).toContain('#2681ff')
  })
})
