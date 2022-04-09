<template>
  <div
    class="color-picker"
    ref="colorPicker"
    @dragstart.stop="onColorItemDragStart"
    @dragover.prevent.stop="onColorItemDragOver"
    @drop.prevent.stop="onColorItemDrop"
  >
    <color-item
      class="color-item"
      v-for="(item, index) in valueList"
      :key="item + index"
      :style="colorItemStyle"
      :value="item"
      :selected="colorItemSelected(index)"
      :data-index="index"
      :draggable="valueList.length > 1"
    />
    <add-color-item
      class="add-color-item"
      v-if="addColor && addColorItemShow"
      ref="addColorItem"
      :selected="colorItemSelected(-1)"
      :data-index="-1"
    />
    <transition>
      <picker
        class="picker"
        ref="picker"
        :value="selectedColor"
        :format="format"
        :show-alpha="showAlpha"
        :colors="colors"
        v-show="isPickerShow"
        @change="onPickChange"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, provide, computed, watch, nextTick, unref } from 'vue'
import type { PropType } from 'vue'
import Picker from './picker'
import ColorItem from './color-item'
import AddColorItem from './add-color-item'
import type { Theme, Format } from './constant'
import { createPopper } from '@popperjs/core'
export default defineComponent({
  name: 'ColorPicker',
  components: {
    ColorItem,
    Picker,
    AddColorItem
  },
  props: {
    value: {
      type: [String, Array] as PropType<string | string[]>
    },
    theme: {
      type: String as PropType<Theme>,
      default: 'light'
    },
    size: {
      type: Number,
      default: 20
    },
    format: {
      type: String as PropType<Format>,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: false
    },
    addColor: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 13
    },
    colors: {
      type: Array,
      default: () => [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#ff4500',
        '#ff7d4d',
        '#00babd',
        '#1f93ff',
        '#fa64c3'
      ]
    }
  },
  emits: ['change', 'update:value', 'overflowMax'],
  setup (props, { emit }) {
    const handleValueList = () => {
      if (props.value == null) {
        return ref([''])
      } else {
        return computed(() => Array.isArray(props.value) ? props.value : [props.value])
      }
    }
    const valueList = handleValueList()
    const colorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))
    const selectedIndex = ref<undefined|number>(undefined)
    // 设置添加初始值
    const selectedColor = computed<undefined|string>(() => unref(valueList)[unref(selectedIndex)])
    const colorItemSelected = (index) => {
      return (props.addColor ? unref(valueList).length > 0 : unref(valueList).length > 1) && unref(selectedIndex) === index
    }
    const isPickerShow = ref(false)
    const isInitPickColor = ref(props.addColor)
    const onOpenPickerShow = () => {
      isPickerShow.value = true
      isInitPickColor.value = false
    }
    watch(() => selectedIndex.value, () => {
      isInitPickColor.value = true
    })
    const onClosePickerShow = () => {
      selectedIndex.value = undefined
      isPickerShow.value = false
      picker.value?.resetValue()
    }
    const colorPicker = ref<HTMLElement>()
    const picker = ref()
    let popperInstance = null
    const handleDestroyPopper = () => {
      popperInstance?.destroy?.()
      popperInstance = null
    }
    const onColorClick = (e: Event) => {
      e?.stopPropagation()
      const target = e.target as HTMLElement
      const popper = unref(picker).$el as HTMLElement
      const isPopperContains = popper?.contains(target) || false
      // 点击卡片区域
      if (isPopperContains) {
        return
      }
      const index = target.dataset?.index
      const isColorItem = !unref(colorPicker)?.isEqualNode(target) && unref(colorPicker)?.contains(target)
      if (!isColorItem || index == null) {
        // 关闭卡片
        if (unref(isPickerShow)) onClosePickerShow()
        return
      }
      selectedIndex.value = +index
      nextTick(() => {
        onOpenPickerShow()
        popperInstance = createPopper(target, popper, {
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
        })
        popperInstance?.update()
      })
    }
    const addColorItemShow = ref(props.max > unref(valueList).length)
    const oldColorValue = ref(undefined)
    const onPickChange = (color: string) => {
      if (unref(isInitPickColor)) {
        return
      }
      const index = unref(selectedIndex)
      if (unref(oldColorValue) === color) {
        return
      }
      oldColorValue.value = color
      if (index !== -1) {
        // 改变数值
        let value: string | string [] = ''
        const isArr = Array.isArray(props.value)
        if (isArr) {
          const temp = unref(valueList).slice()
          temp[index] = color
          value = temp
        } else {
          value = color
        }
        const valueArr = (isArr ? value : [value]) as string []
        if (props.value == null) {
          valueList.value = valueArr
        } else {
          emit('update:value', props.addColor ? valueArr : value)
          emit('change', props.addColor ? valueArr : value, color, index)
        }
      } else {
        const values = unref(valueList).slice()
        if (props.max > values.length) {
          values.push(color)
          const index = values.length - 1
          // 添加
          if (props.value == null) {
            valueList.value = values
          } else {
            emit('update:value', values)
            emit('change', values, color, index)
          }
          selectedIndex.value = index
          nextTick(() => {
            isInitPickColor.value = false
          })
          // 达到最大值
          if (props.max <= values.length) {
            addColorItemShow.value = false
            emit('overflowMax')
          }
        } else {
          emit('overflowMax')
        }
      }
    }
    let dragTargetIndex: undefined | number
    const onColorItemDragStart = (e) => {
      e.dataTransfer.effectAllowed = 'move'
      const target = e.target as HTMLElement
      dragTargetIndex = +target.dataset.index
    }
    const onColorItemDragOver = (e: DragEvent) => {}
    const onColorItemDrop = (e) => {
      const target = e.target as HTMLElement
      const insertIndex = +target.dataset.index
      const colorList = [...unref(valueList)]
      const targetColor = colorList[dragTargetIndex]
      colorList.splice(dragTargetIndex, 1)
      const firstColorList = colorList.slice(0, insertIndex)
      const lastColorList = colorList.splice(insertIndex)
      const values = firstColorList.concat([targetColor]).concat(lastColorList)
      emit('update:value', values)
      emit('change', values, values[dragTargetIndex], dragTargetIndex)
    }
    const theme = computed(() => props.theme)
    const changeTheme = () => {
      unref(colorPicker)?.setAttribute('pick-colors-theme', unref(theme))
    }
    watch(() => props.theme, () => {
      changeTheme()
    })
    provide('theme', {
      theme
    })
    onMounted(() => {
      changeTheme()
      document.addEventListener('click', onColorClick, false)
    })
    onUnmounted(() => {
      handleDestroyPopper()
      document.removeEventListener('click', onColorClick, false)
    })
    return {
      valueList,
      colorItemStyle,
      colorItemSelected,
      selectedColor,
      selectedIndex,
      isPickerShow,
      addColorItemShow,
      onPickChange,
      colorPicker,
      onColorClick,
      picker,
      onColorItemDragStart,
      onColorItemDragOver,
      onColorItemDrop
    }
  }
})
</script>

<style scoped lang="less">
.color-picker {
  display: inline-block;
}

.color-item {
  margin: 5px;
}

.add-color-item {
  margin: 5px;
}

.picker {
  will-change: transform;
  z-index: 9;
  transition: left 60ms ease-in-out, top 60ms ease-in-out;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
  opacity:1;
  transform: scaleY(1);
  transform-origin: center top;
}

[data-popper-placement='top'] {
  transform-origin: center bottom;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
