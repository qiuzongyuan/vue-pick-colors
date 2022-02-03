<template>
  <div class="color-item" :style="colorItemStyle">
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive } from 'vue'
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
    }
  },
  setup (props) {
    const canvas = ref<HTMLCanvasElement>()
    const colorItemStyle = reactive({
      width: `${props.size}px`,
      height: `${props.size}px`
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
  border-radius: 5px;
  border: 1px solid #d9d9d9;
}
</style>
