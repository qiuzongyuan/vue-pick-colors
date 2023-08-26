<template>
  <div class="input">
    <span class="label">
      {{ label }}
    </span>
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
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'Input',
  props: {
    label: {
      type: String,
      default: 'RGBA'
    },
    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 168
    }
  },
  emits: ['change', 'focus', 'blur', 'enter'],
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
    return {
      onInput,
      valueStyle,
      onFocus,
      onBlur,
      onEnter
    }
  }
})
</script>

<style scoped lang="less">
.input {
  display: inline-block;
  font-size: 12px;
}
.label {
  width: 45px;
  height: 30px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #999999;
  background: #e7e8e9;
}
[pick-colors-theme='dark'] .label {
  color: #999;
  background: #252930;
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
