<template>
  <div class="picker" :style="pickerStyle">
    <div class="picker-inner">
      <div class="picker-header">
        <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
        <hue class="hue" :hue="h" @change="onSelectHue"/>
        <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
      </div>
      <input-value :label="label" :value="colorValue" :width="inputWidth" @change="onInputChange"  @blur="handleChange" @enter="handleChange"/>
      <Colors class="colors" v-if="colors.length > 0" :colors="colors" :selected-index="selectColorIndex" @change="onSelectColor"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, unref } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import InputValue from './InputValue.vue'
import Colors from './Colors.vue'
import { hsvFormat, hsv2rgb, checkColorValue, transformHsva, checkColorFormat, filterHsva } from '../utils'
import type { Format } from '../constant'
export default defineComponent({
  name: 'Picker',
  inheritAttrs: false,
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
      type: Array as PropType<string []>,
      default: () => []
    },
    style: {
      type: Object as PropType<Partial<CSSProperties>>,
      default: () => ({})
    }
  },
  emits: ['change', 'update:value'],
  setup (props, { emit }) {
    const pickerStyle = computed<Partial<CSSProperties>>(() => ({ ...props.style, width: props.showAlpha ? '230px' : '205px' }))
    const inputWidth = computed(() => props.showAlpha ? 165 : 140)
    const hsva = ref()
    const cacheHsva = ref()

    const colorValue = ref()
    const handleTransformValue = () => {
      const value = props.value?.trim()
      if (value != null && value !== '') {
        const format = checkColorFormat(value)
        return filterHsva(transformHsva(value, format, props.showAlpha))
      }
      return null
    }
    watch(() => props.value, () => {
      if (props.value !== unref(colorValue)) {
        hsva.value = handleTransformValue()
      }
    }, {
      immediate: true
    })
    watch(hsva, (hsva, oldHsva) => {
      let color = ''
      if (hsva != null) {
        color = hsvFormat({ ...hsva }, props.format, props.showAlpha)
        cacheHsva.value = { ...hsva }
      } else {
        cacheHsva.value = null
      }
      colorValue.value = color
      const originValue = handleTransformValue()
      if (JSON.stringify(hsva) !== JSON.stringify(originValue) && JSON.stringify(hsva) !== JSON.stringify(oldHsva)) {
        emit('change', color)
      }
    }, {
      immediate: true
    })
    const h = computed(() => unref(hsva)?.h || 0)
    const s = computed(() => unref(hsva)?.s || 0)
    const v = computed(() => unref(hsva)?.v || 0)
    const a = computed(() => unref(hsva)?.a != null ? unref(hsva)?.a : 1)
    const rgb = computed(() => hsv2rgb(unref(h), unref(s), unref(v)))
    const rgbStr = computed(() => `rgb(${unref(rgb).r}, ${unref(rgb).g}, ${unref(rgb).b})`)
    const label = computed(() => {
      const format = props.format
      const showAlpha = props.showAlpha
      if (showAlpha) {
        switch (format) {
          case 'hsv':
            return 'HSVA'
          case 'hsl':
            return 'HSLA'
          case 'rgb':
            return 'RGBA'
          default:
            return 'HEX'
        }
      } else {
        switch (format) {
          case 'hsv':
            return 'HSV'
          case 'hsl':
            return 'HSL'
          case 'rgb':
            return 'RGB'
          default:
            return 'HEX'
        }
      }
    })
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
    const selectColorIndex = ref(-1)
    const handleColorChange = (color: string, format: Format, showAlpha: boolean) => {
      if (color.length === 0) return
      const hsv = transformHsva(color, format, showAlpha)
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
    const onSelectColor = (color: string, index: number) => {
      selectColorIndex.value = index
      color = color.trim()
      if (color === '') {
        hsva.value = null
      } else {
        const format = checkColorFormat(color)
        if (format) {
          handleColorChange(color, format, true)
        } else {
          // 无效值
          hsva.value = null
        }
      }
    }
    const handleChange = () => {
      const color = unref(colorValue)?.trim()
      if (color === '') {
        hsva.value = null
        return
      }
      const showAlpha = props.showAlpha
      const format = props.format
      const isCheck = checkColorValue(color, format, showAlpha)
      if (isCheck) {
        handleColorChange(color, format, showAlpha)
      } else {
        // 无效值
        if (unref(cacheHsva) != null) {
          hsva.value = unref(cacheHsva)
        } else {
          colorValue.value = ''
        }
      }
    }
    const onInputChange = (color: string) => {
      selectColorIndex.value = -1
      colorValue.value = color
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
      handleChange,
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
