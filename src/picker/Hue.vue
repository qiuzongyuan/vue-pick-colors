<template>
  <div class="hue" @mousedown.prevent.stop="onSelect" @touchstart.prevent.stop="onSelect">
    <canvas ref="canvas" />
    <div class="slider" :style="sliderStyle" />
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
      if (!canvas.value) return

      canvas.value.width = props.width
      canvas.value.height = props.height
      const ctx = canvas.value.getContext('2d')
      if (!ctx) return

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

    // 适配移动端的选择事件
    const onSelect = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLCanvasElement
      const { top } = target.getBoundingClientRect()

      const onSelectMoving = (e: MouseEvent | TouchEvent) => {
        let clientY
        if (e instanceof MouseEvent) {
          clientY = e.clientY
        } else if (e instanceof TouchEvent) {
          clientY = e.touches[0].clientY
        }

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
        document.removeEventListener('touchmove', onSelectMoving)
        document.removeEventListener('touchend', onSelectEnd)
      }

      // 单次点击选择
      onSelectMoving(e)

      // 鼠标事件
      if (e instanceof MouseEvent) {
        document.addEventListener('mousemove', onSelectMoving)
        document.addEventListener('mouseup', onSelectEnd)
      }

      // 触摸事件
      if (e instanceof TouchEvent) {
        e.preventDefault() // 防止触摸滑动页面
        document.addEventListener('touchmove', onSelectMoving, { passive: false })
        document.addEventListener('touchend', onSelectEnd)
      }
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
  touch-action: none; /* 禁止默认的触摸行为（如页面滚动） */
}

.slider {
  width: 100%;
  background: #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 0;
  z-index: 1;
  pointer-events: none; /* 禁止滑块接受鼠标或触摸事件 */
}
</style>
