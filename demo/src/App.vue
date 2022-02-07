<template>
  <color-picker v-model:value="value" @change="onChange"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ColorPicker from '../../src/index'
export default defineComponent({
  name: 'App',
  components: {
    ColorPicker
  },
  setup () {
    const value = ref('')
    const onChange = (value) => {
      console.log(value)
    }
    return {
      value,
      onChange
    }
  }
})
</script>

<style scoped>

</style>
