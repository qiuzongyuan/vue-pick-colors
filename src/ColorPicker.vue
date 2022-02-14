<template>
  <div class="color-picker" ref="colorPicker" @click.stop="openPickerShow">
    <color-item :value="value"/>
    <transition name="popup">
      <picker
        class="picker"
        :value="value"
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
import { defineComponent, ref, onMounted, onUnmounted, provide } from 'vue'
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
      type: String,
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
    format: {
      type: String as PropType<Format>,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: false
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
        '#ff7800',
        '#00babd',
        '#1f93ff',
        '#fa64c3'
      ]
    }
  },
  emits: ['change', 'update:value'],
  setup (props, { emit }) {
    const isPickerShow = ref(false)
    const openPickerShow = () => {
      isPickerShow.value = true
    }
    const closePickerShow = () => {
      isPickerShow.value = false
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
    const onPickChange = (value) => {
      emit('change', value)
      emit('update:value', value)
    }
    return {
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
  position: relative;
  width: 20px;
  height: 20px;
}

.picker {
  position: absolute;
  top: 25px;
  left: 0;
  will-change: height;
}

.popup-enter-active,
.popup-leave-active {
  transition: height 50ms ease-in;
  height: auto;
  overflow: hidden;
}

.popup-enter-from,
.popup-leave-to {
  height:0;
}
</style>
