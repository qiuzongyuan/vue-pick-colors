<template>
  <canvas ref="canvas"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  name: 'Preview',
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 30
    }
  },
  setup (props) {
    const canvas = ref<HTMLCanvasElement>()
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
      canvas.value.width = props.width
      canvas.value.height = props.height
      const canvasSquare = createAlphaSquare(5)
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, props.width, props.height)
      ctx.fillStyle = props.color
      ctx.fillRect(0, 0, props.width, props.height)
    }
    watch(() => props.color, () => {
      renderColor()
    })
    onMounted(() => {
      renderColor()
    })
    return {
      canvas
    }
  }
})
</script>

<style scoped>

</style>
