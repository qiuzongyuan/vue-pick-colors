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
      v-for="(value, index) in valueList"
      :ref="(el) => colorItemsRef[index] = el"
      :key="value + index"
      :size="size"
      :width="width"
      :height="height"
      :value="value"
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
    <teleport :to="popupContainer == null ?  'body' :  popupContainer">
      <transition>
        <picker
          class="picker"
          ref="picker"
          :value="selectedColor"
          :format="format"
          :show-alpha="showAlpha"
          :colors="colors"
          v-show="isShowPicker"
          @change="onPickerChange"
          @format="onPickerFormat"
        />
    </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, provide, computed, watch, nextTick, unref, toRaw } from 'vue'
import type { RendererElement, PropType } from 'vue'
import { createPopper } from '@popperjs/core'
import Picker from './picker'
import ColorItem from './color-item'
import AddColorItem from './add-color-item'
import type { Theme, Format } from './constant'
import { colorFormat, popperOptions } from './utils'
export default defineComponent({
  name: 'ColorPicker',
  components: {
    ColorItem,
    Picker,
    AddColorItem
  },
  props: {
    // 由外层属性控制
    value: {
      type: [String, Array] as PropType<string | string[]>
    },
    theme: {
      type: String as PropType<Theme>,
      default: 'light'
    },
    size: {
      type: [Number, String],
      default: 20
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    format: {
      type: String as PropType<Format>,
      default: 'hex'
    },
    showPicker: {
      type: Boolean,
      default: undefined
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
    },
    popupContainer: {
      type: [String, Object] as PropType<string | RendererElement>
    }
  },
  emits: ['change', 'update:value', 'update:showPicker', 'overflowMax', 'closePicker'],
  setup (props, { emit }) {
    const valueList = ref<string []>([])
    watch(
      () => props.value,
      () => {
        const value = props.value
        const values = Array.isArray(value) ? value : [value]
        const formatValues = values?.map((value) => {
          const formatValue = colorFormat(value, props.format, props.showAlpha)
          return formatValue
        })
        console.log('formatValues', formatValues)
        valueList.value = formatValues
      },
      {
        immediate: true
      }
    )
    const selectedIndex = ref<undefined|number>(undefined)
    // 设置添加初始值
    const selectedColor = computed<undefined|string>(() => unref(valueList)[unref(selectedIndex)])

    const colorItemSelected = (index) => {
      return (props.addColor ? unref(valueList).length > 0 : unref(valueList).length > 1) && unref(selectedIndex) === index
    }
    const isShowPicker = ref()
    watch(
      () => props.showPicker,
      () => {
        isShowPicker.value = props.showPicker
      },
      {
        immediate: true
      }
    )
    const onOpenPickerShow = () => {
      if (props.showPicker === undefined) {
        isShowPicker.value = true
      } else {
        emit('update:showPicker', true)
      }
    }

    const onClosePickerShow = () => {
      selectedIndex.value = undefined
      if (!props.showPicker) {
        isShowPicker.value = false
      } else {
        emit('update:showPicker', false)
      }
      emit('closePicker', toRaw(Array.isArray(props.value) || props.addColor ? unref(valueList) : unref(valueList)[0]))
    }
    const colorPicker = ref<HTMLElement>()
    const picker = ref()
    let popperInstance = null
    const handleDestroyPopper = () => {
      popperInstance?.destroy?.()
      popperInstance = null
    }

    const onPickerFormat = (value: string) => {
      unref(valueList)[unref(selectedIndex)] = value
    }
    const onColorClick = async (e: Event) => {
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
        if (unref(isShowPicker)) onClosePickerShow()
        return
      }

      selectedIndex.value = +index

      nextTick(() => {
        onOpenPickerShow()
        popperInstance = createPopper(target, popper, popperOptions)
        popperInstance?.update()
      })
    }
    const addColorItemShow = ref(props.max > unref(valueList).length)
    const onPickerChange = (color: string) => {
      const index = unref(selectedIndex)
      const values = unref(valueList).slice()
      const len = unref(valueList).length
      if (index == null) {
        return
      }
      if (index >= 0) {
        // 修改
        values[index] = color
      } else {
        // 添加
        selectedIndex.value = len
        values.push(color)
      }

      let value: string | string [] = ''
      const isArr = Array.isArray(props.value)
      // 满足传入数组或添加
      if (isArr || props.addColor) {
        value = values
      } else {
        value = color
      }

      if (props.value === undefined) {
        valueList.value = Array.isArray(value) ? value : [value]
      } else {
        emit('update:value', value)
        emit('change', value, color, index)
      }

      // 添加到最大
      if (props.addColor && len >= props.max) {
        addColorItemShow.value = false
        emit('overflowMax')
      }
    }
    let dragTargetIndex: undefined | number
    const onColorItemDragStart = (e: DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      const target = e.target as HTMLElement
      dragTargetIndex = +target.dataset.index
    }
    const onColorItemDragOver = (e: DragEvent) => {}
    const onColorItemDrop = (e: DragEvent) => {
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
    }, {
      immediate: true
    })
    provide('theme', {
      theme
    })
    const colorItemsRef = ref([])
    onMounted(() => {
      document.addEventListener('click', onColorClick, false)
      const target = unref(colorItemsRef)[0].$el as HTMLElement
      const popper = unref(picker).$el as HTMLElement
      if (props.showPicker && target && popper) {
        popperInstance = createPopper(target, popper, popperOptions)
        popperInstance?.update()
        selectedIndex.value = 0
      }
    })
    onUnmounted(() => {
      handleDestroyPopper()
      document.removeEventListener('click', onColorClick, false)
    })
    return {
      valueList,
      colorItemSelected,
      selectedColor,
      selectedIndex,
      isShowPicker,
      addColorItemShow,
      onPickerChange,
      onPickerFormat,
      colorPicker,
      onColorClick,
      picker,
      onColorItemDragStart,
      onColorItemDragOver,
      onColorItemDrop,
      colorItemsRef
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
  transition: left 60ms ease-in-out;
  // transition: all 60ms ease-in-out;
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
