<template>
  <canvas class="color-item" :style="colorItemStyle" ref="canvas"/>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed, inject, unref } from 'vue'
import type { PropType } from 'vue'
import type { Format } from '../constant'
export default defineComponent({
  name: 'ColorItem',
  props: {
    size: {
      type: Number,
      default: 20
    },
    value: {
      type: String,
      default: ''
    },
    format: {
      type: String as PropType<Format>,
      default: 'hex'
    },
    border: {
      type: Boolean,
      default: true
    },
    borderRadius: {
      type: Number,
      default: 5
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  setup (props) {
    const canvas = ref<HTMLCanvasElement>()
    const { theme } = inject('theme')
    const colorItemStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      border: props.border ? `1px solid ${unref(theme) === 'dark' ? '#434345' : '#d9d9d9'}` : '',
      borderRadius: `${props.borderRadius}px`,
      boxShadow: props.selected ? `0 0 3px 2px ${unref(theme) === 'dark' ? '#2681ff' : '#1890ff'}` : ''
    }))
    const createAlphaSquare = (size: number) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const doubleSize = size * 2
      canvas.width = doubleSize
      canvas.height = doubleSize
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, doubleSize, doubleSize)
      ctx.fillStyle = '#ccd5db'
      ctx.fillRect(0, 0, size, size)
      ctx.fillRect(size, size, size, size)
      return canvas
    }
    const renderColor = () => {
      const ctx = canvas.value.getContext('2d')
      canvas.value.width = props.size
      canvas.value.height = props.size
      const canvasSquare = createAlphaSquare(5)
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, props.size, props.size)
      ctx.fillStyle = props.value
      ctx.fillRect(0, 0, props.size, props.size)
    }
    watch(() => props.value, () => {
      renderColor()
    })
    onMounted(() => {
      renderColor()
    })
    return {
      canvas,
      colorItemStyle
    }
  }
})
</script>

<style scoped lang="less">
.color-item {
  display: inline-block;
  vertical-align: top;
}
</style>
