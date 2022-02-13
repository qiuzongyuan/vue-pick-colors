<template>
  <div class="color-picker" ref="colorPicker" @click.stop="openPickerShow">
    <color-item :value="value"/>
    <transition name="popup">
      <picker
        class="picker"
        :value="value"
        :format="format"
        :show-alpha="showAlpha"
        v-show="isPickerShow"
        @change="onPickChange"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import Picker from './picker'
import ColorItem from './color-item'
export default defineComponent({
  name: 'ColorPicker',
  components: {
    ColorItem,
    Picker
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    mode: {
      type: String as PropType<'single' | 'multiple'>,
      default: 'single'
    },
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light'
    },
    format: {
      type: String as PropType<'rgb' | 'hex' | 'hsl'>,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: true
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
}

.popup-enter-active,
.popup-leave-active {
  transition: height 60ms ease-in;
}

.popup-enter-from,
.popup-leave-to {
  height: 0;
}
</style>
