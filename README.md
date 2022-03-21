### [vue-pick-colors](https://github.com/qiuzongyuan/vue-pick-colors)
>  🎉 A Color picker for Vue.js 3

> [🇨🇳中文版](https://github.com/qiuzongyuan/vue-pick-colors/blob/main/README-zh_CN.md)
<div style="display: flex">
    <img src="./images/effect-light.png" style="width:200px;" />
    <img src="./images/effect-dark.png" style="width:200px;" />
</div>
<br/>

### Installation
```
npm install vue-pick-colors
```
or
```
yarn add vue-pick-colors
```
<br/>

### Usage
```vue
<template>
  <pick-colors v-model:value="value" show-alpha/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PickColors from 'vue-pick-colors'
export default defineComponent({
  name: 'App',
  components: {
    PickColors
  },
  setup () {
    const value = ref('#00cedf')
    return {
      value
    }
  }
})
</script>
```
<br/>

### API

| Property       | Description                                               | Type              | Default                                                                                                                             |
|----------------|-----------------------------------------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| value(v-model) | binding value<br>support hex、rgb、rgba、hsl、hsla            | string ｜ string[] | -                                                                                                                                    |
| format         | color format                                              | hex ｜ rgb ｜ hsl   | hex                                                                                                                                 |
| show-alpha     | whether to display the alpha slider                       | boolean           | false                                                                                                                               |
| size           | color block size                                          | number            | 20                                                                                                                                  |
| theme          | component theme                                           | light ｜ dark      | light                                                                                                                               |
| colors         | predefined color options<br>support hex、rgb、rgba、hsl、hsla | string []         | ['#ff4500','#ff8c00','#ffd700',<br>'#90ee90','#00ced1','#1e90ff',<br>'#c71585','#ff4500','#ff7800',<br>'#00babd','#1f93ff','#fa64c3'] |
| add-color      | support for adding colors                                 | boolean           | false                                                                                                                               |
| max            | maximum number of colors to add                           | number            | 13                                                                                                                                  |


<br/>

### Events

| Events Name  | Description        | Arguments                                                          |
|--------------|--------------------|---------------------------------------------------------------|
| change       | color value change | function(value: string｜string [],color: string,index: number) |
| overflow-max | color added to max | —                                                             |
