<template>
  <div class="picker">
    <div class="picker-header">
      <saturation class="saturation" :hue="h" :saturation="s" :value="v" @change="onSelectSaturation"/>
      <hue class="hue" :hue="h" @change="onSelectHue"/>
      <alpha class="alpha" :alpha="a" :color="rgbStr" @change="onSelectAlpha" v-if="showAlpha"/>
    </div>
    <input-value :label="label" :color="color" :width="inputWidth" @change="onInputChange"/>
    <Colors />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { hsvFormat, hsv2rgb, checkColor, transformHsv } from './utils'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import InputValue from './InputValue.vue'
import Colors from './Colors.vue'
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
      type: String as PropType<'rgb' | 'hex' | 'hsl'>,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    colors: {
      type: Array
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const a = ref(1)
    const h = ref(0)
    const s = ref(0)
    const v = ref(0)
    const rgb = computed(() => hsv2rgb(h.value, s.value, v.value))
    const rgbStr = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
    const rgbaStr = computed(() => `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, ${a.value})`)
    const color = computed(() => hsvFormat({
      h: h.value,
      s: s.value,
      v: v.value,
      a: a.value
    }, props.format, props.showAlpha))
    watch(() => color.value, (color) => {
      emit('change', color)
    })
    const inputWidth = computed(() => props.showAlpha ? 168 : 145)
    const label = computed(() => props.format.toLocaleUpperCase())
    const onSelectHue = (hue: number) => {
      h.value = hue
    }
    const onSelectSaturation = (saturation, value) => {
      s.value = saturation
      v.value = value
    }
    const onSelectAlpha = (alpha) => {
      a.value = alpha
    }
    const onInputChange = (color: string) => {
      if (!color.length) return
      if (!checkColor(color.trim(), props.format, props.showAlpha)) return
      const hsv = transformHsv(color.trim(), props.format, props.showAlpha)
      const { h: hue, s: Saturation, v: value } = hsv
      if (isNaN(hue) || isNaN(Saturation) || isNaN(value)) return
      h.value = hue
      s.value = Saturation
      v.value = value
      const alpha = (hsv as any).a
      if (props.showAlpha && !isNaN(alpha)) {
        a.value = alpha
      }
    }
    return {
      h,
      s,
      v,
      a,
      rgbStr,
      rgbaStr,
      onSelectSaturation,
      onSelectHue,
      onSelectAlpha,
      label,
      color,
      inputWidth,
      onInputChange
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
</style>
