<template>
  <div
      class="color-picker"
      ref="colorPicker"
      @dragstart.stop="onColorItemDragStart"
      @dragover.prevent.stop="onColorItemDragOver"
      @drop.prevent.stop="onColorItemDrop"
      @click.stop="onColorClick"
  >
    <color-item
        class="color-item"
        v-for="(value, index) in values"
        :key="index"
        :ref="(el) => colorItemsRef[index] = el"
        :size="size"
        :width="width"
        :height="height"
        :value="value"
        :selected="colorItemSelected(index)"
        :data-index="index"
        :draggable="valueList.length > 1"
        :format="format"
    />
    <add-color-item
        class="add-color-item"
        v-if="addColor && addColorItemShow"
        ref="addColorItem"
        :selected="colorItemSelected(-1)"
        :data-index="-1"
    />
    <teleport :to="toPopupContainer" :disabled="teleportDisabled">
      <transition>
        <picker
            class="picker"
            :style="pickerStyle"
            ref="pickerRef"
            :value="selectedColor"
            :format="format"
            :show-alpha="showAlpha"
            :colors="colors"
            v-if="isShowPicker"
            @change="onPickerChange"
        />
      </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, provide, computed, watch, unref, toRaw, nextTick } from 'vue'
import type { PropType } from 'vue'
import Picker from './picker'
import ColorItem from './color-item'
import AddColorItem from './add-color-item'
import type { Theme, Format } from './constant'
import usePopper from './hooks/usePopper'
import { colorFormat } from './utils'

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
    deleteColor: {
      type: Boolean,
      default: true
    },
    max: {
      type: Number,
      default: 13
    },
    popupContainer: {
      type: [String, Object, Boolean] as PropType<string | HTMLElement | boolean>,
      default: 'body'
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    colors: {
      type: Array as PropType<string []>,
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
  emits: ['change', 'update:value', 'update:showPicker', 'overflowMax', 'closePicker'],
  setup (props, { emit }) {
    const valueList = ref<string []>([])
    const values = computed(() => unref(valueList).map((value) => colorFormat(value, 'hex', props.showAlpha)))
    watch(
      () => props.value,
      () => {
        const value = props.value || ''
        const values = Array.isArray(value) ? value : [value]
        valueList.value = values.map(value => colorFormat(value, props.format, props.showAlpha))
      }, {
        immediate: true
      })
    const selectedIndex = ref<undefined | number>(undefined)
    // 设置添加初始值
    const selectedColor = computed<undefined | string>(() => unref(valueList)[unref(selectedIndex)])

    const colorItemSelected = (index) => {
      return (props.addColor ? unref(valueList).length > 0 : unref(valueList).length > 1) && unref(selectedIndex) === index
    }
    const isShowPicker = ref(false)
    watch(
      () => props.showPicker,
      () => {
        isShowPicker.value = props.showPicker
      },
      {
        immediate: true
      }
    )
    const targetRef = ref(null)
    const pickerRef = ref(null)

    const { style: pickerStyle } = usePopper(targetRef, pickerRef, { zIndex: props.zIndex })

    const onOpenPicker = () => {
      if (unref(targetRef) == null) targetRef.value = unref(colorItemsRef)[0]
      if (unref(selectedIndex) == null) selectedIndex.value = 0
      if (props.showPicker === undefined) {
        isShowPicker.value = true
      } else {
        emit('update:showPicker', true)
      }
    }

    const onClosePicker = () => {
      selectedIndex.value = undefined
      if (props.showPicker === undefined) {
        isShowPicker.value = false
      } else {
        emit('update:showPicker', false)
      }
      emit('closePicker', toRaw(Array.isArray(props.value) || props.addColor ? unref(valueList) : unref(valueList)[0]))
    }
    const colorPicker = ref<HTMLElement>()

    let openTimer: ReturnType<typeof setTimeout> | undefined
    const onColorClick = async (e: Event) => {
      const target = e.target as HTMLElement
      const index = target.dataset?.index
      if (index == null || index === '') return
      const i = +index
      if (unref(selectedIndex) === i) return
      if (unref(selectedIndex) != null && unref(selectedIndex) !== i) {
        // 在同一个组件里面
        onClosePicker()
        if (openTimer) clearTimeout(openTimer)
        openTimer = setTimeout(() => {
          onOpenPicker()
          clearTimeout(openTimer)
        }, 100)
      } else {
        onOpenPicker()
      }
      selectedIndex.value = i
      targetRef.value = target
    }
    let closeTimer: ReturnType<typeof setTimeout> | undefined
    const onAllClick = async (e: Event) => {
      const target = e.target as HTMLElement
      const isColorItem = !unref(colorPicker)?.isEqualNode(target) && unref(colorPicker)?.contains(target)
      if (isColorItem) return
      const popperTarget = unref(pickerRef)?.$el as HTMLElement
      const isPopperContains = popperTarget?.contains(target) || false
      // 点击卡片区域
      if (isPopperContains) return
      if (closeTimer) clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        // 关闭卡片
        if (unref(isShowPicker)) onClosePicker()
      }, 0)
    }
    watch(isShowPicker, () => {
      if (unref(isShowPicker)) {
        onOpenPicker()
        clearTimeout(closeTimer)
      }
    })
    const addColorItemShow = ref(props.max > unref(valueList).length)
    const toPopupContainer = computed<string | HTMLElement>(() => {
      if (typeof props.popupContainer === 'string' || (typeof props.popupContainer === 'object' && props.popupContainer != null)) {
        return props.popupContainer
      }
      return 'body'
    })
    const teleportDisabled = computed(() => {
      if (typeof props.popupContainer === 'boolean') {
        return props.popupContainer === false
      }
      return false
    })
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
    const onColorItemDragOver = (e: DragEvent) => {
    }
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
      nextTick(() => {
        unref(colorPicker)?.setAttribute('pick-colors-theme', unref(theme))
        unref(pickerRef)?.$el?.setAttribute('pick-colors-theme', unref(theme))
      })
    }
    watch(() => [props.theme, unref(pickerRef)], () => {
      changeTheme()
    }, {
      immediate: true
    })
    provide('theme', {
      theme
    })
    const colorItemsRef = ref([])
    onMounted(() => {
      document.addEventListener('mouseup', onAllClick, false)
      if (props.showPicker) {
        onOpenPicker()
      }
    })
    onUnmounted(() => {
      document.removeEventListener('mouseup', onAllClick, false)
      if (openTimer) {
        clearTimeout(openTimer)
        openTimer = null
      }
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
    })
    return {
      valueList,
      colorItemSelected,
      selectedColor,
      selectedIndex,
      isShowPicker,
      addColorItemShow,
      onPickerChange,
      colorPicker,
      onColorClick,
      pickerRef,
      onColorItemDragStart,
      onColorItemDragOver,
      onColorItemDrop,
      colorItemsRef,
      pickerStyle,
      values,
      teleportDisabled,
      toPopupContainer
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
  display: inline-block;
}

.picker {
  overflow: hidden;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  opacity: 1;
  transform: scaleY(1);
  transform-origin: center top;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
