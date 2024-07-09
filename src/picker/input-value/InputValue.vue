<template>
  <div class="input">
    <FormatValue
      :value="format"
      :showAlpha="showAlpha"
      :options="formatOptions"
      @change="onFormatChange"
    />
    <input
      class="value"
      :style="valueStyle"
      :value.prop="value"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { Format } from '../../constant'
import FormatValue from './FormatValue.vue'
export default defineComponent({
  name: 'Input',
  components: {
    FormatValue
  },
  props: {
    format: {
      type: String,
      default: 'RGBA'
    },
    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number
    },
    showAlpha: {
      type: Boolean
    },
    formatOptions: {
      type: [Boolean, Array] as PropType<Format [] | Boolean>
    }
  },
  emits: ['change', 'focus', 'blur', 'enter', 'formatChange'],
  setup (props, { emit }) {
    const valueStyle = computed(() => ({
      minWidth: `${props.width}px`,
      maxWidth: `${props.width}px`,
      width: `${props.width}px`
    }))
    const onInput = (e) => {
      emit('change', e.target?.value)
    }
    const onFocus = () => {
      emit('focus')
    }
    const onBlur = () => {
      emit('blur')
    }
    const onEnter = () => {
      emit('enter')
    }
    const onFormatChange = (format) => {
      emit('formatChange', format)
    }
    return {
      onInput,
      valueStyle,
      onFocus,
      onBlur,
      onEnter,
      onFormatChange
    }
  }
})
</script>

<style scoped lang="less">
.input {
  display: flex;
  font-size: 12px;
}

.value {
  flex: 1;
  height: 30px;
  text-align: center;
  background: #eceef0;
  box-sizing: border-box;
  border: 1px solid #eceef0;
  color: #666666;
}
[pick-colors-theme='dark'] .value {
  background: #2e333a;
  border: 1px solid #2e333a;
  color: #ffffff;
}
.value:focus {
  outline: none;
  border: 1px solid #1890ff;
}
</style>
