<template>
  <div class="color-picker" @click.stop="openPickerShow">
    <color-item :value="value"/>
    <transition name="popup">
      <picker
        class="picker"
        :format="format"
        :show-alpha="showAlpha"
        v-show="isPickerShow"
        v-model:value="value"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
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
  setup () {
    const isPickerShow = ref(false)
    const value = ref('')
    const openPickerShow = () => {
      isPickerShow.value = true
    }
    const closePickerShow = () => {
      isPickerShow.value = false
    }
    onMounted(() => {
      document.addEventListener('click', closePickerShow)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closePickerShow)
    })
    watch(() => value, (value) => {
      console.log(value)
    })
    return {
      value,
      isPickerShow,
      openPickerShow,
      closePickerShow
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
