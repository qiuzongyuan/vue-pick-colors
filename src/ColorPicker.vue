<template>
  <div class="color-picker" ref="colorPicker" @click.stop>
    <div class="color-list">
      <div
        class="color-item-wrapper"
        :style="colorItemWrapperStyle"
        v-for="(item, index) in valueList"
        :key="item + index"
        @click="onColorClick($event, index)"
      >
        <color-item
          class="color-item"
          :style="colorItemStyle"
          :value="item"
          :selected="colorItemSelected(index)"
        />
      </div>
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
        :style="pickerStyle"
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
import { defineComponent, ref, onMounted, onUnmounted, provide, computed } from 'vue'
import type { PropType } from 'vue'
import Picker from './picker'
import ColorItem from './color-item'
import AddColorItem from './add-color-item'
import type { Theme, Format } from './constant'
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
    addMaxCount: {
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
  emits: ['change', 'update:value', 'arriveMaxCount'],
  setup (props, { emit }) {
    const valueList = computed(() => Array.isArray(props.value) ? props.value : [props.value])
    const colorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))
    const colorItemWrapperStyle = computed(() => ({
      width: `${props.size + 2}px`,
      height: `${props.size + 2}px`
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
    const pickerTop = ref(0)
    const pickerLeft = ref(0)
    const pickerStyle = computed(() => ({
      top: `${pickerTop.value}px`,
      left: `${pickerLeft.value}px`
    }))
    const selectedColor = ref(valueList.value[0])
    const onColorClick = (e: PointerEvent, index: number = -1) => {
      const target = event.currentTarget as HTMLElement
      const { offsetTop, offsetHeight, offsetLeft } = target
      pickerTop.value = offsetTop + offsetHeight + 5
      pickerLeft.value = offsetLeft
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
    const colorPicker = ref<HTMLElement>()
    provide('theme', {
      theme: props.theme
    })
    onMounted(() => {
      colorPicker.value.setAttribute('pick-colors-theme', props.theme)
      document.addEventListener('click', closePickerShow)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closePickerShow)
    })
    const addColorItemShow = ref(true)
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
        if (props.addMaxCount > value.length) {
          value.push(color)
          const index = value.length - 1
          selectedIndex.value = index
          // 添加
          emit('update:value', value)
          emit('change', value, color, index)
          const isAddColorItemShow = props.addMaxCount >= (value.length + 1)
          // 达到最大值
          if (!isAddColorItemShow) {
            addColorItemShow.value = isAddColorItemShow
            emit('arriveMaxCount')
          }
        }
      }
    }
    return {
      valueList,
      colorItemStyle,
      colorItemWrapperStyle,
      colorItemSelected,
      selectedColor,
      selectedIndex,
      onColorClick,
      pickerStyle,
      isPickerShow,
      openPickerShow,
      onPickChange,
      colorPicker,
      addColorItemShow
    }
  }
})
</script>

<style scoped lang="less">
.color-picker {
  display: inline-block;
  position: relative;
}
.color-list {
  display: flex;
  flex-wrap: wrap;
}

.color-item-wrapper {
  padding: 5px;
}

.add-color-item {
  margin: 5px;
}

.picker {
  position: absolute;
  left: 0;
  will-change: height;
}

.popup-enter-active,
.popup-leave-active {
  transition: max-height 60ms ease-out;
  overflow: hidden;
  max-height: 233px;
}

.popup-enter-from,
.popup-leave-to {
  max-height:0;
}
</style>
