### [vue-pick-colors](https://github.com/qiuzongyuan/vue-pick-colors)
>  🎉 vue3 颜色拾取器

> [English ](https://github.com/qiuzongyuan/vue-pick-colors)
<div style="display: flex">
    <img src="./images/effect-light.png" style="width:200px;" />
    <img src="./images/effect-dark.png" style="width:200px;" />
</div>
<br/>

### 安装

```
npm install vue-pick-colors
```
或者
```
yarn add vue-pick-colors
```

<br/>

### 使用

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

| 属性   | 说明                                | 类型              | 默认值                                                                                                                                  |
| ---- |-----------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------|
| value(v-model) | 值，<br/>支持hex、rgb、rgba、hsl、hsla    | string ｜ string[] | —                                                                                                                                    |
| format | 格式                                | hex ｜ rgb ｜ hsl | hex                                                                                                                                  |
| show-alpha | 是否支持透明度选择                         | boolean         | false                                                                                                                                |
| size | 颜色块大小                             | number          | 20                                                                                                                                   |
| theme | 主题                                | light ｜ dark    | light                                                                                                                                |
| colors | 预留颜色组<br/>支持hex、rgb、rgba、hsl、hsla | string []       | ['#ff4500','#ff8c00','#ffd700',<br>'#90ee90','#00ced1','#1e90ff',<br>'#c71585','#ff4500','#ff7800',<br>'#00babd','#1f93ff','#fa64c3'] |
| add-color | 支持添加颜色                            | boolean         | false                                                                                                                                |
| max  | 添加颜色最大数                           | number          | 13                                                                                                                                   |


<br/>

### 事件

| 名称   | 说明        | 回调参数                                                          |
|------|-----------|---------------------------------------------------------------|
| change | 颜色值变化     | function(value: string｜string [],color: string,index: number) |
| overflow-max | 颜色添加达到最大值 | —                                                             |
