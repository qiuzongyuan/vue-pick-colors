<template>
  <div class="color-picker" ref="colorPicker" @click.stop>
    <div class="color-list">
      <color-item
        class="color-item"
        v-for="(item, index) in valueList"
        :key="item + index"
        :style="colorItemStyle"
        :value="item"
        :selected="colorItemSelected(index)"
        @click="onColorClick($event, index)"
      />
      <add-color-item
        class="add-color-item"
        v-if="addColor && addColorItemShow"
        @click="onColorClick"
        :selected="selectedIndex === -1"
      />
    </div>
    <transition name="popup">
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
import { defineComponent, ref, onMounted, onUnmounted, provide, computed, watch, nextTick } from 'vue'
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
      type: [String, Array] as PropType<string | string[]>,
      default: '#ff0000'
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
    const valueList = computed(() => Array.isArray(props.value) ? props.value : [props.value])
    const colorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))
    // -2 代表什么也不选择
    const selectedIndex = ref(-2)
    const colorItemSelected = (index) => {
      return (props.addColor ? valueList.value.length > 0 : valueList.value.length > 1) && selectedIndex.value === index
    }
    const isPickerShow = ref(false)
    const openPickerShow = () => {
      isPickerShow.value = true
    }
    const closePickerShow = () => {
      selectedIndex.value = -2
      isPickerShow.value = false
    }
    const selectedColor = ref(valueList.value[0])
    const colorPicker = ref<HTMLElement>()
    const picker = ref()
    const onColorClick = async (e: PointerEvent, index: number = -1) => {
      const target = e.target as HTMLElement
      nextTick(() => {
        createPopper(target, picker.value.$el)
      })
      if (index !== -1) {
        selectedIndex.value = index
        selectedColor.value = valueList.value[index]
      } else {
        // - 1 代表添加
        selectedIndex.value = index
        selectedColor.value = ''
      }
      openPickerShow()
    }
    const theme = computed(() => props.theme)
    const changeTheme = () => {
      colorPicker.value.setAttribute('pick-colors-theme', theme.value)
    }
    watch(() => props.theme, () => {
      changeTheme()
    })
    provide('theme', {
      theme
    })
    onMounted(() => {
      changeTheme()
      document.addEventListener('click', closePickerShow)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closePickerShow)
    })
    const addColorItemShow = ref(props.max > valueList.value.length)
    const onPickChange = (color: string) => {
      const index = selectedIndex.value
      if (index !== -1) {
        // 改变数值
        let value: string | string [] = ''
        if (Array.isArray(props.value)) {
          const temp = valueList.value.slice()
          temp[index] = color
          value = temp
        } else {
          value = color
        }
        emit('update:value', value)
        emit('change', value, color, index)
      } else {
        const value = valueList.value.slice()
        if (props.max > value.length) {
          value.push(color)
          const index = value.length - 1
          selectedIndex.value = index
          // 添加
          emit('update:value', value)
          emit('change', value, color, index)
          const isAddColorItemShow = props.max >= (value.length + 1)
          // 达到最大值
          if (!isAddColorItemShow) {
            addColorItemShow.value = isAddColorItemShow
            emit('overflowMax')
          }
        } else {
          emit('overflowMax')
        }
      }
    }
    return {
      valueList,
      colorItemStyle,
      colorItemSelected,
      selectedColor,
      selectedIndex,
      onColorClick,
      isPickerShow,
      openPickerShow,
      onPickChange,
      colorPicker,
      addColorItemShow,
      picker
    }
  }
})
</script>

<style scoped lang="less">
.color-picker {
  display: inline-block;
}
.color-list {
  display: flex;
  flex-wrap: wrap;
}

.color-item {
  margin: 5px;
}

.add-color-item {
  margin: 5px;
}

.picker {
  z-index: 9;
  will-change: transform;
}

.popup-enter-active,
.popup-leave-active {
  transition: height 60ms ease-out;
  overflow: hidden;
  height: 233px;
}

.popup-enter-from,
.popup-leave-to {
  height:0;
}
</style>
