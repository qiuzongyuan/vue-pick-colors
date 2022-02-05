<template>
  <div class="input">
    <span class="label">
      {{ label }}
    </span>
    <input
      class="value"
      :style="valueStyle"
      :value="value"
      @input="onInput"
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
  emits: ['update:value', 'change'],
  setup (props, { emit }) {
    const valueStyle = computed(() => ({
      minWidth: `${props.width}px`,
      maxWidth: `${props.width}px`,
      width: `${props.width}px`
    }))
    const onInput = (e) => {
      const value = (e.target as any).value
      emit('update:value', value)
      emit('change', value)
    }
    return {
      onInput,
      valueStyle
    }
  }
})
</script>

<style scoped lang="less">
.input {
  display: flex;
  font-size: 12px;
}
.label {
  width: 45px;
  height: 30px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  background: #e7e8e9;
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

.value:focus {
  outline: none;
  border: 1px solid #1890ff;
}
</style>
