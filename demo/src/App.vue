<template>
  <pick-colors
    v-model:value="value"
    :show-alpha="false"
    :format="'rgb'"
    :theme="theme"
    add-color
    @change="onColorChange"
  />
<!--  <button @click="onSwitchTheme">切换主题</button>-->
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
    const onColorChange = (value: string | string[], color: string, index: number) => {
      console.log(value, color, index)
    }
    const theme = ref('light')
    const onSwitchTheme = () => {
      if (theme.value === 'light') {
        theme.value = 'dark'
      } else {
        theme.value = 'light'
      }
      console.log(theme.value)
    }
    return {
      value,
      onColorChange,
      theme,
      onSwitchTheme
    }
  }
})
</script>

<style scoped>

</style>
