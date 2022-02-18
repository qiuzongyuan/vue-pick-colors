<template>
  <pick-colors style="width: 200px" :format="'hsl'" v-model:value="value" show-alpha theme="dark"/>
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
    const value = ref('#00ced1ff')
    // const value = ref(['#00ced1ff'])
    // const value = ref(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])
    return {
      value
    }
  }
})
</script>

<style scoped>

</style>
