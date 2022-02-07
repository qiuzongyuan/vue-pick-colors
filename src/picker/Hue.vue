<template>
  <div class="hue" @mousedown.stop.prevent="onSelect">
    <canvas ref="canvas"/>
    <div class="slider" :style="sliderStyle"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'Hue',
  props: {
    width: {
      type: Number,
      default: 15
    },
    height: {
      type: Number,
      default: 160
    },
    hue: {
      type: Number,
      default: 0
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const sliderHeight = 4
    const sliderHeightHalf = sliderHeight / 2
    const sliderStyle = computed(() => ({
      top: `${(1 - props.hue / 360) * props.height - sliderHeightHalf}px`,
      height: `${sliderHeight}px`
    }))
    const canvas = ref<HTMLCanvasElement>()
    const renderHue = () => {
      canvas.value.width = props.width
      canvas.value.height = props.height
      const ctx = canvas.value.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, props.height)
      gradient.addColorStop(0, '#FF0000') // red
      gradient.addColorStop(0.17, '#FF00FF') // purple
      gradient.addColorStop(0.17 * 2, '#0000FF') // blue
      gradient.addColorStop(0.17 * 3, '#00FFFF') // green
      gradient.addColorStop(0.17 * 4, '#00FF00') // green
      gradient.addColorStop(0.17 * 5, '#FFFF00') // yellow
      gradient.addColorStop(1, '#FF0000') // red
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, props.width, props.height)
    }
    onMounted(() => {
      renderHue()
    })
    const onSelect = (e: MouseEvent) => {
      const target = e.target as HTMLCanvasElement
      const { top } = target.getBoundingClientRect()
      const onSelectMoving = (e: MouseEvent) => {
        const { clientY } = e
        let y = clientY - top
        if (y < 0) y = 0
        if (y > props.height) y = props.height
        const percent = -((y * 100) / props.height) + 100
        const hue = (360 * percent) / 100
        emit('change', hue)
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
.hue {
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
