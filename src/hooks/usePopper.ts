import { Ref, onBeforeUnmount, ref, unref, watch } from 'vue'
import { Options, Instance, createPopper } from '@popperjs/core'
let instance: Instance = null
const usePopper = (target: Ref<any>, popper: Ref<any>) => {
  const style = ref<Partial<CSSStyleDeclaration>>()
  const options: Options = {
    strategy: 'absolute',
    placement: 'auto',
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
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top'],
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
            left: '0',
            top: '0',
            ...popper,
            transformOrigin: placement === 'top' ? 'center bottom' : ''
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
    instance = createPopper(_target, _popper, options)
    instance.update()
  })
  onBeforeUnmount(() => {
    instance.destroy()
    instance = null
  })
  return {
    instance,
    style
  }
}

export default usePopper
