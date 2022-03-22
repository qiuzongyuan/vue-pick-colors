<template>
  <pick-colors
    v-model:value="value"
    :show-alpha="false"
    :theme="theme"
    add-color
    @change="onColorChange"
  />
  <br />
  <pick-colors v-model:value="value2" format="hsl" show-alpha :theme="theme" @change="onColorChange2"/>
  <br />
  <pick-colors value="#333" show-alpha :theme="theme"/>
  <br />
  <pick-colors :theme="theme"/>
  <br />
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
    const value = ref('#333')
    // const value = ref(['#00ced1ff'])
    // const value = ref(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])
    const value2 = ref('')
    const onColorChange = (value: string | string[], color: string, index: number) => {
      console.log(value, color, index)
    }
    const onColorChange2 = (value: string | string[], color: string, index: number) => {
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
      onColorChange2,
      theme,
      onSwitchTheme,
      value2
    }
  }
})
</script>

<style scoped>

</style>
