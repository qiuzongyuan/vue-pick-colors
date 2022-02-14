<template>
  <pick-colors show-alpha theme="dark"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PickColors from '../../src/index'
export default defineComponent({
  name: 'App',
  components: {
    PickColors
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
