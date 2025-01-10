<template>
  <div
    class="saturation"
    :style="saturationStyle"
    @mousedown.prevent.stop="onSelect"
    @touchstart.prevent.stop="onSelect"
  >
    <div class="saturation-white" />
    <div class="saturation-black" />
    <div class="slider" :style="sliderStyle" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'Saturation',
  props: {
    size: {
      type: Number,
      default: 160
    },
    hue: {
      type: Number,
      default: 0
    },
    saturation: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: 0
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const saturationStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      background: `hsl(${props.hue}, 100%, 50%)`
    }))
    const sliderSize = 10
    const sliderRadius = sliderSize / 2
    const sliderStyle = computed(() => ({
      top: `${((100 - props.value) / 100) * props.size - sliderRadius}px`,
      left: `${(props.saturation * props.size / 100) - sliderRadius}px`,
      width: `${sliderSize}px`,
      height: `${sliderSize}px`
    }))
    const onSelect = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLCanvasElement
      const { left, top } = target.getBoundingClientRect()

      // 处理鼠标或触摸开始事件
      const onSelectMoving = (e: MouseEvent | TouchEvent) => {
        let clientX, clientY

        // 兼容触摸事件和鼠标事件
        if (e instanceof MouseEvent) {
          clientX = e.clientX
          clientY = e.clientY
        } else if (e instanceof TouchEvent) {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        }

        // 计算相对于目标元素的坐标
        let x = clientX - left
        let y = clientY - top

        // 保证坐标在有效范围内
        if (x < 0) x = 0
        if (y < 0) y = 0
        if (x > props.size) x = props.size
        if (y > props.size) y = props.size

        const saturation = (x / props.size) * 100
        const value = 100 - (y / props.size) * 100

        emit('change', saturation, value)
      }

      // 单次点击选择
      onSelectMoving(e)

      const onSelectEnd = () => {
        document.removeEventListener('mousemove', onSelectMoving)
        document.removeEventListener('mouseup', onSelectEnd)
        document.removeEventListener('touchmove', onSelectMoving)
        document.removeEventListener('touchend', onSelectEnd)
      }

      onSelectMoving(e)

      if (e instanceof MouseEvent) {
        document.addEventListener('mousemove', onSelectMoving)
        document.addEventListener('mouseup', onSelectEnd)
      }

      if (e instanceof TouchEvent) {
        e.preventDefault() // 防止页面滑动
        document.addEventListener('touchmove', onSelectMoving, { passive: false })
        document.addEventListener('touchend', onSelectEnd)
      }
    }

    return {
      saturationStyle,
      sliderStyle,
      onSelect
    }
  }
})
</script>

<style scoped lang="less">
.saturation {
  position: relative;
}

.saturation-white,
.saturation-black {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

.saturation-white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}
.saturation-black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

.slider {
  position: absolute;
  top: 0;
  left:0;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 1;
}
</style>
