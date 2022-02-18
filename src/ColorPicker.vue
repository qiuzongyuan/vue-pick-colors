<template>
  <div class="color-picker" ref="colorPicker" @click.stop>
    <template v-if="Array.isArray(value)">
      <div class="color-list">
        <div
          v-for="(item, index) in value"
          :key="item + index"
          @click="onColorClick($event, index)"
        >
          <color-item
            class="color-item"
            :style="colorItemStyle"
            :value="item"
            :selected="selectedIndex === index && selectHighlight"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div @click="onColorClick($event, 0)">
        <color-item
          :style="colorItemStyle"
          :value="value"
          :selected="selectedIndex === 0 && selectHighlight"
        />
      </div>
    </template>
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
import type { Theme, Format } from './constant'
export default defineComponent({
  name: 'ColorPicker',
  components: {
    ColorItem,
    Picker
  },
  props: {
    value: {
      type: [String, Array] as PropType<string | string[]>,
      default: '#ff0000'
    },
    mode: {
      type: String as PropType<'single' | 'multiple'>,
      default: 'single'
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
    selectHighlight: {
      type: Boolean,
      default: true
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
  emits: ['change', 'update:value'],
  setup (props, { emit }) {
    const colorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))
    const selectedIndex = ref(-1)
    const isPickerShow = ref(false)
    const openPickerShow = () => {
      isPickerShow.value = true
    }
    const closePickerShow = () => {
      selectedIndex.value = -1
      isPickerShow.value = false
    }
    const pickerTop = ref(0)
    const pickerStyle = computed(() => ({
      top: `${pickerTop.value}px`
    }))
    const selectedColor = ref(Array.isArray(props.value) ? props.value[0] : props.value)
    const onColorClick = (e: PointerEvent, index: number = -1) => {
      const target = event.currentTarget as HTMLElement
      const { offsetHeight, offsetTop } = target
      pickerTop.value = offsetTop + offsetHeight
      selectedIndex.value = index
      selectedColor.value = Array.isArray(props.value) ? props.value[index] : props.value
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
    const onPickChange = (color: string) => {
      let value: string | string [] = ''
      if (Array.isArray(props.value)) {
        const temp = props.value.slice()
        temp[selectedIndex.value] = color
        value = temp
      } else {
        value = color
      }
      emit('update:value', value)
      emit('change', color)
    }
    return {
      colorItemStyle,
      selectedColor,
      selectedIndex,
      onColorClick,
      pickerStyle,
      isPickerShow,
      openPickerShow,
      onPickChange,
      colorPicker
    }
  }
})
</script>

<style scoped lang="less">
.color-picker {
  display: flow-root;
  position: relative;
}

.color-list {
  margin-bottom: 10px;
  margin-right: 10px;
  display: flex;
  flex-wrap: wrap;
}

.color-item {
  margin-top: 10px;
  margin-left: 10px;
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
