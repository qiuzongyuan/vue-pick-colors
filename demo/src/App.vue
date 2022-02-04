<template>
  <color-picker/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ColorPicker from '../../src/index'
export default defineComponent({
  name: 'App',
  components: {
    ColorPicker
  }
})
</script>

<style scoped>

</style>
