<template>
  <div
    class="saturation"
    :style="saturationStyle"
    @mousedown.stop.prevent="onSelect"
  >
    <div class="saturation-white"></div>
    <div class="saturation-black"></div>
    <div class="slider" :style="sliderStyle"/>
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
    const onSelect = (e: MouseEvent) => {
      const target = e.target as HTMLCanvasElement
      const { left, top } = target.getBoundingClientRect()
      const onSelectMoving = (e: MouseEvent) => {
        const { clientX, clientY } = e
        let x = clientX - left
        let y = clientY - top
        if (x < 0) x = 0
        if (y < 0) y = 0
        if (x > props.size) x = props.size
        if (y > props.size) y = props.size
        // sliderStyle.left = `${x - sliderRadius}px`
        // sliderStyle.top = `${y - sliderRadius}px`
        const saturation = (x / props.size) * 100
        const value = 100 - (y / props.size) * 100
        emit('change', saturation, value)
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
