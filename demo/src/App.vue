<template>
  <pick-colors style="width: 200px" v-model:value="value" :format="'rgb'" show-alpha add-color :theme="theme"/>
  <button @click="onSwitchTheme">切换主题</button>
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
    const theme = ref('light')
    const onSwitchTheme = () => {
      if (theme.value === 'light') {
        theme.value = 'dark'
      } else {
        theme.value = 'light'
      }
      console.log(theme.value)
    }
    // const value = ref(['#00ced1ff'])
    // const value = ref(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])
    return {
      value,
      theme,
      onSwitchTheme
    }
  }
})
</script>

<style scoped>

</style>
