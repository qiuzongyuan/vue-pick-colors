<template>
  <div class="picker" :style="pickerStyle">
    <div class="picker-inner" ref="picker">
      <div class="picker-header">
        <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
        <hue class="hue" :hue="h" @change="onSelectHue"/>
        <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
      </div>
      <input-value :label="label" :color="color" :width="inputWidth" @change="onInputChange"/>
      <Colors class="colors" v-if="colors.length > 0" :colors="colors" :selected-index="selectColorIndex" @select="onSelectColor"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import type { PropType } from 'vue'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import InputValue from './InputValue.vue'
import Colors from './Colors.vue'
import { hsvFormat, hsv2rgb, checkColor, transformHsv, checkColorFormat, filterHsva } from '../utils'
import type { Format } from '../constant'
export default defineComponent({
  name: 'Picker',
  components: {
    Colors,
    Saturation,
    Hue,
    Alpha,
    InputValue
  },
  props: {
    format: {
      type: String as PropType<Format>,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    colors: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit, expose }) {
    const pickerStyle = computed(() => ({ width: props.showAlpha ? '230px' : '205px' }))
    const inputWidth = computed(() => props.showAlpha ? 165 : 140)
    const hsva = ref({ h: 0, s: 0, v: 0, a: 0 })
    watch(() => props.value, (value: string) => {
      if (value.length > 0) {
        const format = checkColorFormat(value)
        hsva.value = filterHsva(transformHsv(value, format, props.showAlpha))
      }
    }, {
      immediate: true
    })
    const h = computed(() => hsva.value.h)
    const s = computed(() => hsva.value.s)
    const v = computed(() => hsva.value.v)
    const a = computed(() => hsva.value.a)
    const rgb = computed(() => hsv2rgb(h.value, s.value, v.value))
    const rgbStr = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
    const color = computed(() => hsvFormat({
      h: h.value,
      s: s.value,
      v: v.value,
      a: a.value
    }, props.format, props.showAlpha))
    watch(color, (color) => {
      emit('change', color)
    })
    const label = computed(() => props.format.toLocaleUpperCase())
    const selectColorIndex = ref(-1)
    const onSelectColor = (color: string, index: number) => {
      const format = checkColorFormat(color)
      selectColorIndex.value = index
      handleColorChange(color, format, true)
    }
    const onSelectHue = (hue: number) => {
      selectColorIndex.value = -1
      hsva.value = {
        ...hsva.value,
        h: hue
      }
    }
    const onSelectSaturation = (saturation, value) => {
      selectColorIndex.value = -1
      hsva.value = {
        ...hsva.value,
        s: saturation,
        v: value
      }
    }
    const onSelectAlpha = (alpha) => {
      selectColorIndex.value = -1
      hsva.value = {
        ...hsva.value,
        a: alpha
      }
    }
    const handleColorChange = (color: string, format: Format, showAlpha: boolean) => {
      if (!color.length) {
        hsva.value = {
          h: 0,
          s: 0,
          v: 0,
          a: 0
        }
        return
      }
      const hsv = transformHsv(color.trim(), format, showAlpha)
      const { h, s, v } = hsv
      if (isNaN(h) || isNaN(s) || isNaN(v)) return
      let a = 1
      const alpha = (hsv as any).a
      if (!isNaN(alpha)) {
        a = alpha
      }
      hsva.value = {
        h,
        s,
        v,
        a
      }
    }
    const onInputChange = (color: string) => {
      if (!checkColor(color.trim(), props.format, props.showAlpha)) return
      handleColorChange(color, props.format, props.showAlpha)
    }
    return {
      h,
      s,
      v,
      a,
      rgbStr,
      onSelectSaturation,
      onSelectHue,
      onSelectAlpha,
      label,
      color,
      pickerStyle,
      inputWidth,
      onInputChange,
      selectColorIndex,
      onSelectColor
    }
  }
})
</script>

<style scoped lang="less">
.picker {
  background: #f7f8f9;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgb(0 0 0 / 16%);
  width: 233px;
}
.picker-inner {
  padding: 10px;
}
[pick-colors-theme='dark'] .picker {
  background: #1d2024;
  box-shadow: 0 0 16px 0 rgb(0 0 0 / 16%);
}
.picker-header {
  display: flex;
  margin-bottom: 5px;
}
.hue {
  margin-left: 10px;
}
.alpha {
  margin-left: 10px;
}
.colors {
  margin-top: 5px;
}
</style>
