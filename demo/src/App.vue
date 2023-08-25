<template>
  <pick-colors v-model:value="value2" format="hsl" :theme="theme" @change="onColorChange2" :showPicker="true" @closePicker="closePicker"/>
  <br />
  <pick-colors value="#333" show-alpha :theme="theme" :width="40" :size="60" @closePicker="closePicker"/>
  <br />
  <pick-colors v-model:value="value3" :theme="theme" @closePicker="closePicker"/>
  <br />
  <pick-colors
    :theme="theme"
    show-alpha
    add-color
    @change="onColorChange"
    :colors="['', 'rgba(0,0,0,1)', 'hsla(0, 52%, 31%, 1)', '#3333']"
    :max="3"
    @closePicker="closePicker"
  />
  <br />
  <button @click="onSwitchTheme">切换主题</button>
  <div ref="divRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PickColors, { Theme } from '../../src/index'
export default defineComponent({
  name: 'App',
  components: {
    PickColors
  },
  setup () {
    const value = ref('#222')
    const value2 = ref('#333')
    const value3 = ref(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])
    const onColorChange = (value: string | string[], color: string, index: number) => {
      console.log(value, color, index)
    }
    const onColorChange2 = (value: string | string[], color: string, index: number) => {
      console.log(value, color, index)
    }
    const theme = ref<Theme>('light')
    const onSwitchTheme = () => {
      if (theme.value === 'light') {
        theme.value = 'dark'
      } else {
        theme.value = 'light'
      }
      console.log(theme.value)
    }
    const showPicker = ref(true)
    const divRef = ref()
    const closePicker = (e) => {
      console.log(e)
    }
    return {
      value,
      onColorChange,
      onColorChange2,
      theme,
      onSwitchTheme,
      value2,
      value3,
      showPicker,
      divRef,
      closePicker
    }
  }
})
</script>

<style scoped>

</style>
