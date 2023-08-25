<template>
  <canvas class="color-item" :style="colorItemStyle" ref="canvas" :draggable="draggable"/>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed, inject, unref } from 'vue'
import type { PropType } from 'vue'
import type { Format } from '../constant'
export default defineComponent({
  name: 'ColorItem',
  props: {
    size: {
      type: [Number, String],
      default: 20
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
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
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  setup (props) {
    const canvas = ref<HTMLCanvasElement>()
    const { theme } = inject('theme', {
      theme: 'light'
    })
    const width = computed(() => parseFloat((props.width || props.size) + ''))
    const height = computed(() => parseFloat((props.height || props.size) + ''))
    const colorItemStyle = computed(() => {
      return {
        width: `${unref(width)}px`,
        height: `${unref(height)}px`,
        border: props.border ? `1px solid ${unref(theme) === 'dark' ? '#434345' : '#d9d9d9'}` : '',
        borderRadius: `${props.borderRadius}px`,
        boxShadow: props.selected ? `0 0 3px 2px ${unref(theme) === 'dark' ? '#2681ff' : '#1890ff'}` : ''
      }
    })
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
      canvas.value.width = unref(width)
      canvas.value.height = unref(height)
      const canvasSquare = createAlphaSquare(5)
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, unref(width), unref(height))
      ctx.fillStyle = props.value
      ctx.fillRect(0, 0, unref(width), unref(height))
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
