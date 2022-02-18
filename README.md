### [vue-pick-colors：颜色拾取器](https://github.com/qiuzongyuan/vue-pick-colors)

<div style="display: flex">
    <img src="./images/effect-light.png" style="width:200px;" />
    <img src="./images/effect-dark.png" style="width:200px;" />
</div>
<br/>
安装：

```
npm i vue-pick-colors -S
```
<br/>
事例：

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
API：

| 属性           | 说明                                       | 类型                | 默认值                                                                                                                                           |
| -------------- | ------------------------------------------ |-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| value(v-model) | 值<br>支持hex、rgb、rgba、hsl、hsla      | string ｜ string[] | #ff0000                                                                                                                                       |
| format         | 格式                                       | 'hex' ｜ 'rgb' ｜ 'hsl'   | hex                                                                                                                                           |
| show-alpha     | 是否支持透明度选择                         | boolean           | false                                                                                                                                         |
| size           | 色块大小                                   | number            | 20                                                                                                                                            |
| theme          | 主题                                       | 'light' ｜ 'dark'      | light                                                                                                                                         |
| colors         | 预留颜色组<br>支持hex、rgb、rgba、hsl、hsla | string []         | ['#ff4500', '#ff8c00', '#ffd700',<br>'#90ee90', '#00ced1', '#1e90ff',<br>'#c71585', '#ff4500', '#ff7800',<br>'#00babd', '#1f93ff', '#fa64c3'] |
| add-color      | 添加颜色                                   | boolean           | false                                                                                                                                         |
| add-max-count  | 添加颜色最大数                             | number            | 13                                                                                                                                            |


<br/>
事件：

| 事件名称       | 说明                          | 回调参数                                                            |
|------------|-----------------------------|-----------------------------------------------------------------|
| change     | 颜色变化时回调函数<br>使用添加颜色时值将会变成数组 | Function(value: string｜string [], color: string, index: number) |
| add-to-max | 颜色添加到最大值时触发                 | —                                                               |
