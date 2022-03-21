<template>
  <div class="picker" :style="pickerStyle">
    <div class="picker-inner">
      <div class="picker-header">
        <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
        <hue class="hue" :hue="h" @change="onSelectHue"/>
        <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
      </div>
      <input-value :label="label" :value="colorValue" :width="inputWidth" @change="onInputChange"/>
      <colors class="colors" v-if="colors.length > 0" :colors="colors" :selected-index="selectColorIndex" @change="onSelectColor"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, unref } from 'vue'
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
    // 定义颜色列表
    colors: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const pickerStyle = computed(() => ({ width: props.showAlpha ? '230px' : '205px' }))
    const inputWidth = computed(() => props.showAlpha ? 165 : 140)
    const handleTransformValue = (value:string) => {
      value = value.trim()
      if (value.length > 0) {
        const format = checkColorFormat(value)
        return filterHsva(transformHsv(value, format, props.showAlpha))
      } else {
        return null
      }
    }
    const hsva = ref<null | { h: number, s: number, v: number, a: number}>(handleTransformValue(props.value))
    const h = computed(() => unref(hsva)?.h || 0)
    const s = computed(() => unref(hsva)?.s || 0)
    const v = computed(() => unref(hsva)?.v || 0)
    const a = computed(() => unref(hsva)?.a || 1)
    const rgb = computed(() => hsv2rgb(unref(h), unref(s), unref(v)))
    const rgbStr = computed(() => `rgb(${unref(rgb).r}, ${unref(rgb).g}, ${unref(rgb).b})`)
    const colorValue = computed(() => {
      if (unref(hsva) != null) {
        return hsvFormat({ ...unref(hsva) }, props.format, props.showAlpha)
      }
      return ''
    })
    watch(colorValue, (colorValue) => {
      emit('change', colorValue)
    })
    const label = computed(() => props.format.toLocaleUpperCase())
    const selectColorIndex = ref(-1)
    const onSelectColor = (color: string, index: number) => {
      const format = checkColorFormat(color)
      selectColorIndex.value = index
      color = color.trim()
      if (color === '') hsva.value = null
      handleColorChange(color, format, true)
    }
    const onSelectHue = (hue: number) => {
      selectColorIndex.value = -1
      if (unref(hsva) == null) {
        hsva.value = {
          h: hue,
          s: unref(s),
          v: unref(v),
          a: unref(a)
        }
      }
      hsva.value = {
        ...unref(hsva),
        h: hue
      }
    }
    const onSelectSaturation = (saturation, value) => {
      selectColorIndex.value = -1
      if (unref(hsva) == null) {
        hsva.value = {
          h: unref(h),
          s: saturation,
          v: value,
          a: unref(a)
        }
      } else {
        hsva.value = {
          ...unref(hsva),
          s: saturation,
          v: value
        }
      }
    }
    const onSelectAlpha = (alpha) => {
      selectColorIndex.value = -1
      if (unref(hsva) == null) {
        hsva.value = {
          h: unref(h),
          s: unref(s),
          v: unref(v),
          a: alpha
        }
      } else {
        hsva.value = {
          ...unref(hsva),
          a: alpha
        }
      }
    }
    const handleColorChange = (color: string, format: Format, showAlpha: boolean) => {
      if (color.length === 0) {
        hsva.value = null
        return
      }
      const hsv = transformHsv(color, format, showAlpha)
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
      color = color.trim()
      if (color === '') {
        hsva.value = null
        return
      }
      if (checkColor(color, props.format, props.showAlpha)) {
        handleColorChange(color, props.format, props.showAlpha)
      }
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
      colorValue,
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
