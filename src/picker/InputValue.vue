<template>
  <div class="input">
    <span class="label">
      {{ label }}
    </span>
    <input class="value" :value="value" @input="onInput"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    }
  },
  emits: ['update:value', 'change'],
  setup (props, { emit }) {
    const onInput = (e) => {
      const value = (e.target as any).value
      console.log(value)
      emit('update:value', value)
      emit('change', value)
    }
    return {
      onInput
    }
  }
})
</script>

<style scoped lang="less">
.input {
  display: flex;
  font-size: 13px;
}
.label {
  width: 50px;
  height: 30px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  background: #e7e8e9;
}
.value {
  @value-width: 170px;
  flex: 1;
  height: 30px;
  min-width: @value-width;
  max-width: @value-width;
  width: @value-width;
  padding: 0 12px;
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
