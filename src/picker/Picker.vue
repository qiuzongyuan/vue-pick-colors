<template>
  <div class="picker">
    <div class="picker-header">
      <saturation class="saturation" :hue="h" @change="onSelectSaturation"/>
      <hue class="hue" @change="onSelectHue"/>
      <alpha class="alpha" :color="rgbStr" @change="onSelectAlpha"/>
    </div>
    <input-value :value="value"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import InputValue from './InputValue.vue'
import { formatColor, hsv2rgb } from './utils'
export default defineComponent({
  name: 'Picker',
  components: {
    Saturation,
    Hue,
    Alpha,
    InputValue
  },
  props: {
    format: {
      type: String as PropType<'rgb' | 'hex' | 'hsl'>,
      default: 'rgb'
    },
    showAlpha: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:value'],
  setup (props, { emit }) {
    const a = ref(1)
    const h = ref(0)
    const s = ref(0)
    const v = ref(0)
    const rgb = computed(() => hsv2rgb(h.value, s.value, v.value))
    const rgbStr = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
    const rgbaStr = computed(() => `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, ${a.value})`)
    const value = computed(() => formatColor({
      h: h.value,
      s: s.value,
      v: v.value,
      a: a.value
    }, props.format, props.showAlpha))
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
    watch(rgbaStr, (value) => {
      emit('update:value', value)
    })
    return {
      h,
      rgbStr,
      rgbaStr,
      onSelectSaturation,
      onSelectHue,
      onSelectAlpha,
      value
    }
  }
})
</script>

<style scoped lang="less">
.picker {
  width: 210px;
  background: #f7f8f9;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgb(0 0 0 / 16%);
  padding: 10px;
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
