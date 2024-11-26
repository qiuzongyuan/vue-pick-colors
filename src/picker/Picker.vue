<template>
  <div class="picker" :style="pickerStyle">
    <div class="picker-inner">
      <div class="picker-header">
        <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
        <hue class="hue" :hue="h" @change="onSelectHue"/>
        <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
      </div>
        <input-value
          :format="handleInputFormat(format)"
          :value="colorValue"
          :showAlpha="showAlpha"
          :width="showAlpha ? 150 : 125"
          :formatOptions="formatOptions"
          @change="onInputChange"
          @blur="handleChange"
          @enter="handleChange"
          @formatChange="onFormatChange"
        />
      <Colors class="colors" v-if="colors.length > 0" :colors="colors" :selected-index="selectColorIndex" @change="onSelectColor"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, unref } from 'vue'
import type { PropType, CSSProperties } from 'vue'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import InputValue from './input-value'
import Colors from './Colors.vue'
import { hsvFormat, hsv2rgb, transformHsva, checkColorFormat, filterHsva, checkHsva } from '../utils'
import { ALPHA_FORMAT_MAP, Format, FORMAT_MAP } from '../constant'
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
      type: Array as PropType<string []>,
      default: () => []
    },
    style: {
      type: Object as PropType<Partial<CSSProperties>>,
      default: () => ({})
    },
    formatOptions: {
      type: [Boolean, Array] as PropType<Format [] | Boolean>
    }
  },
  emits: ['change', 'formatChange'],
  setup (props, { emit }) {
    const pickerStyle = computed<Partial<CSSProperties>>(() => ({ ...props.style, width: props.showAlpha ? '230px' : '205px' }))
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
    watch(() => [unref(hsva), props.format], ([hsva, oldHsva]) => {
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
    const handleInputFormat = (format: Format) => {
      if (props.showAlpha) {
        return ALPHA_FORMAT_MAP[format]
      } else {
        return FORMAT_MAP[format]
      }
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
      const { showAlpha } = props
      const format = checkColorFormat(color)
      const newHsva = filterHsva(transformHsva(color, format, showAlpha))
      const isCheck = checkHsva(newHsva)
      if (isCheck) {
        hsva.value = newHsva
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
    const onFormatChange = (format) => {
      emit('formatChange', format)
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
      handleInputFormat,
      colorValue,
      pickerStyle,
      onInputChange,
      handleChange,
      selectColorIndex,
      onSelectColor,
      onFormatChange
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
[pick-colors-theme='dark'] .picker-inner  {
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
