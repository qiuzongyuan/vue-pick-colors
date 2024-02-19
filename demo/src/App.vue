<template>
  <div>
    <pick-colors v-model:value="value2" format="hsl" @change="onColorChange2" @closePicker="closePicker"/>
    <br />
    <button @click="toggleShowPicker">{{ showPicker ? '关闭' : '打开' }}</button>
    <pick-colors v-model:show-picker="showPicker" v-model:value="value" show-alpha :width="40" :size="60" @closePicker="closePicker"/>
    <br />
    <pick-colors v-model:value="value3" format="hsv" showAlpha :theme="theme" @closePicker="closePicker"/>
    <br />
    <pick-colors
      :theme="theme"
      show-alpha
      add-color
      @change="onColorChange"
      :colors="['', 'rgba(0,0,0,1)', 'hsla(0, 52%, 31%, 1)', '#3333']"
      :max="3"
      @closePicker="closePicker"
      :popup-container="false"
    />
    <br />
    <button @click="onSwitchTheme">切换主题</button>
    <div ref="divRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import PickColors, { Theme } from '../../src/index'
export default defineComponent({
  name: 'App',
  components: {
    PickColors
  },
  setup () {
    const value = ref('')
    const value2 = ref('')
    watch(value2, () => {
      console.log(value2.value);
      
    })
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
    const showPicker = ref(false)
    const divRef = ref()
    const closePicker = (e) => {
      console.log(e)
    }
    const toggleShowPicker = () => {
      showPicker.value = true
      console.log('showPicker', showPicker.value);
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
      closePicker,
      toggleShowPicker
    }
  }
})
</script>

<style scoped>
</style>
