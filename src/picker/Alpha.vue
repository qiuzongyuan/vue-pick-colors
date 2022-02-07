<template>
  <div class="alpha" @mousedown.stop.prevent="onSelect">
    <canvas ref="canvas"/>
    <div class="slider" :style="sliderStyle"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  name: 'Alpha',
  props: {
    width: {
      type: Number,
      default: 15
    },
    height: {
      type: Number,
      default: 160
    },
    color: {
      type: String,
      default: '#000000'
    },
    alpha: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    const sliderHeight = 4
    const sliderHeightHalf = sliderHeight / 2
    const sliderStyle = computed(() => ({
      top: `${props.alpha * props.height - sliderHeightHalf}px`,
      height: `${sliderHeight}px`
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
    const canvas = ref<HTMLCanvasElement>()
    const renderAlpha = () => {
      const ctx = canvas.value.getContext('2d')
      canvas.value.width = props.width
      canvas.value.height = props.height
      const canvasSquare = createAlphaSquare(5)
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, props.width, props.height)
      const gradient = ctx.createLinearGradient(0, 0, 0, props.height)
      gradient.addColorStop(0.01, 'rgba(255,255,255,0)')
      gradient.addColorStop(0.99, props.color)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, props.width, props.height)
    }
    watch(() => props.color, () => {
      renderAlpha()
    })
    onMounted(() => {
      renderAlpha()
    })
    const onSelect = (e: MouseEvent) => {
      const target = e.target as HTMLCanvasElement
      const { top } = target.getBoundingClientRect()
      const onSelectMoving = (e: MouseEvent) => {
        const { clientY } = e
        let y = clientY - top
        if (y < 0) y = 0
        if (y > props.height) y = props.height
        const a = parseFloat((y / props.height).toFixed(2))
        emit('change', a)
      }
      const onSelectEnd = () => {
        document.removeEventListener('mousemove', onSelectMoving)
        document.removeEventListener('mouseup', onSelectEnd)
      }
      // 单点击选择
      onSelectMoving(e)
      // 选择移动
      document.addEventListener('mousemove', onSelectMoving)
      // 选择结束
      document.addEventListener('mouseup', onSelectEnd)
    }
    return {
      canvas,
      sliderStyle,
      onSelect
    }
  }
})
</script>

<style scoped lang="less">
.alpha {
  position: relative;
}
.slider {
  width: 100%;
  background: #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
