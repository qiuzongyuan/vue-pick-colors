<template>
  <color-picker v-model:value="value"/>
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
    return {
      value
    }
  }
})
</script>

<style scoped>

</style>
