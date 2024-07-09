import { Ref, nextTick, onBeforeUnmount, ref, unref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { Options, Instance, createPopper, Placement, PositioningStrategy } from '@popperjs/core'
interface PopperOptions {
  strategy?: PositioningStrategy
  placement?:Placement
  defaultStyle?:Partial<CSSProperties>
}
let instance: Instance = null
const usePopper = (target: Ref<any>, popper: Ref<any>, popperOptions?:PopperOptions) => {
  const style = ref<Partial<CSSProperties>>({})
  const { placement, defaultStyle, strategy } = popperOptions || {}
  const options: Options = {
    strategy: strategy || 'absolute',
    placement: placement || 'auto',
    onFirstUpdate: () => {
      instance.update()
    },
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
          adaptive: true
        }
      },
      {
        name: 'flip',
        options: {
          allowedAutoPlacements: ['top', 'bottom']
        }
      },
      {
        name: 'applyStyles',
        enabled: false
      },
      {
        name: 'updateState',
        enabled: true,
        phase: 'write',
        requires: ['computeStyles'],
        fn: ({ state }) => {
          const { styles, placement } = state
          const { popper } = styles
          style.value = {
            ...popper as CSSProperties,
            ...defaultStyle,
            transformOrigin: placement === 'top' ? 'center bottom' : 'center top'
          }
        }
      }
    ]
  }
  watch(() => [unref(target), unref(popper)], ([target, popper], [oldTarget, oldPopper]) => {
    if (!target || !popper) return
    if (oldTarget === target && oldPopper === oldTarget) return
    instance?.destroy()
    const _target = target.$el || target
    const _popper = popper.$el || popper
    nextTick(() => {
      instance = createPopper(_target, _popper, options)
    })
  })
  onBeforeUnmount(() => {
    if (instance) {
      instance?.destroy()
      instance = null
    }
  })
  return {
    instance,
    style
  }
}

export default usePopper
