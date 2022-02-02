<template>
  <div class="color-picker" @click.stop="openPickerShow">
    <div
      class="color-item"
      :style="{
        background: value
      }"
    >
    </div>
    <transition name="popup">
      <picker
        v-show="isPickerShow"
        class="picker"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import Picker from './picker'
export default defineComponent({
  name: 'ColorPicker',
  components: {
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
    value: {
      type: String,
      default: '#f5222d'
    }
  },
  setup () {
    const isPickerShow = ref(false)
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
    return {
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

.color-item {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
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
