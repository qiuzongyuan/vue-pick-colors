<template>
  <div class="picker">
    <div class="picker-header">
      <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
      <hue class="hue" :hue="h" @change="onSelectHue"/>
      <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
    </div>
    <input-value :label="label" :color="color" :width="inputWidth" @change="onInputChange"/>
    <Colors class="colors" v-if="colors.length > 0" :colors="colors" :select-index="selectColorIndex" @select="onSelectColor"/>
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
import { hsvFormat, hsv2rgb, checkColor, transformHsv, checkColorFormat, filterHsva } from './utils'
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
  setup (props, { emit }) {
    const hsva = filterHsva(transformHsv(props.value, props.format, props.showAlpha))
    const h = ref(hsva.h)
    const s = ref(hsva.s)
    const v = ref(hsva.v)
    const a = ref(hsva.a)
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
    const inputWidth = computed(() => props.showAlpha ? 168 : 145)
    const label = computed(() => props.format.toLocaleUpperCase())
    const selectColorIndex = ref(-1)
    const onSelectColor = (color: string, index: number) => {
      const format = checkColorFormat(color)
      selectColorIndex.value = index
      handleColorChange(color, format, true)
    }
    const onSelectHue = (hue: number) => {
      selectColorIndex.value = -1
      h.value = hue
    }
    const onSelectSaturation = (saturation, value) => {
      selectColorIndex.value = -1
      s.value = saturation
      v.value = value
    }
    const onSelectAlpha = (alpha) => {
      selectColorIndex.value = -1
      a.value = alpha
    }
    const handleColorChange = (color: string, format: Format, showAlpha: boolean) => {
      if (!color.length) {
        h.value = 0
        s.value = 0
        v.value = 0
        a.value = 0
        return
      }
      const hsv = transformHsv(color.trim(), format, showAlpha)
      const { h: hue, s: saturation, v: value } = hsv
      if (isNaN(hue) || isNaN(saturation) || isNaN(value)) return
      h.value = hue
      s.value = saturation
      v.value = value
      if (!props.showAlpha) return
      const alpha = (hsv as any).a
      if (!isNaN(alpha)) {
        a.value = alpha
      } else if (isNaN(alpha)) {
        a.value = 1
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
.saturation {
  margin-right: 10px;
}
.hue {
  margin-right: 10px;
}
.colors {
  margin-top: 5px;
}
</style>