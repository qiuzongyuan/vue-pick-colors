<template>
  <div class="add-color-item" :style="addColorItemStyle">
    <svg class="icon" :style="iconStyle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
      <path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
export default defineComponent({
  name: 'AddColorItem',
  props: {
    size: {
      type: Number,
      default: 20
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const { theme } = inject('theme')
    const addColorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      boxShadow: props.selected ? `0 0 3px 2px ${theme.value === 'dark' ? '#2681ff' : '#1890ff'}` : ''
    }))
    const iconStyle = computed(() => ({
      width: `${props.size - 4}px`
    }))
    return {
      addColorItemStyle,
      iconStyle
    }
  }
})
</script>

<style scoped lang="less">
.add-color-item {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
