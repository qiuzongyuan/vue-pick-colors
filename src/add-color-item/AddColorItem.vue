<template>
  <svg class="add-color-item" :style="addColorItemStyle" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <g class="container">
      <path d="M544 464V160h-80v304H160v80h304v304h80V544h304v-80z"></path>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, inject, unref } from 'vue'
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
    const { theme } = inject('theme', {
      theme: 'light'
    })
    const addColorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      lineHeight: `${props.size}px`,
      boxShadow: props.selected ? `0 0 3px 2px ${unref(theme) === 'dark' ? '#2681ff' : '#1890ff'}` : ''
    }))
    return {
      addColorItemStyle
    }
  }
})
</script>

<style scoped lang="less">
.add-color-item {
  background: #fff;
  vertical-align: top;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
}

.container {
  transform: scale(0.9);
  transform-origin: center;
  pointer-events: none;
}

[pick-colors-theme='dark'] .add-color-item {
  border: 1px solid #434343;
  background: #141414;
}

path {
  fill: #000000;
}

[pick-colors-theme='dark'] path {
  fill: #ffffff;
}
</style>
