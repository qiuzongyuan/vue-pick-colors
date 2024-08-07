### [vue-pick-colors](https://github.com/qiuzongyuan/vue-pick-colors)

>  🎉 vue3 颜色拾取器

> [English](https://github.com/qiuzongyuan/vue-pick-colors/blob/main/README-en.md)

### [Demo](https://qiuzongyuan.github.io/vue-pick-colors/zh/use.html)

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

```
<template>
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```

<br/>

### API

| 属性                 | 说明                                                    | 类型                                    | 默认值                                                       | 版本  |
| -------------------- | ------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ----- |
| value(v-model)       | 值，<br/>支持hex、rgb、rgba、hsl、hsla、hsv、hsva       | string ｜ string[]                      | —                                                            |       |
| show-picker(v-model) | 控制拾取器隐藏或显示                                    | boolean                                 | —                                                            | 1.5.0 |
| size                 | 颜色块大小                                              | number \| string                        | 20                                                           |       |
| width                | 色块宽度<br />如果为空使用 `size`属性                   | number \| string                        | —                                                            | 1.5.0 |
| height               | 色块高度<br />如果为空使用 `size`属性                   | number \| string                        | —                                                            | 1.5.0 |
| theme                | 主题                                                    | light ｜ dark                           | light                                                        |       |
| colors               | 预留颜色组<br/>支持hex、rgb、rgba、hsl、hsla、hsv、hsva | string []                               | ['#ff4500','#ff8c00','#ffd700', '#90ee90','#00ced1','#1e90ff', '#c71585','#ff4500','#ff7800', '#00babd','#1f93ff','#fa64c3'] |       |
| format               | 颜色值格式化                                            | hex ｜ rgb ｜ hsl ｜ hsv                | hex                                                          |       |
| show-alpha           | 是否支持透明度选择                                      | boolean                                 | false                                                        |       |
| add-color            | 是否支持添加颜色                                        | boolean                                 | false                                                        |       |
| popup-container      | 定义拾取器的容器                                        | string \| Vue.RendererElement\| boolean | 'body'                                                       | 1.5.0 |
| z-index              | 拾取器的层级                                            | number                                  | 1000                                                         | 1.5.0 |
| max                  | 添加颜色最大数                                          | number                                  | 13                                                           |       |
| format-options       | 格式选项，当为false时，不出现选项                       | (hex ｜ rgb ｜ hsl ｜ hsv) [] \| false  | false                                | 1.7.0 |
| position             | 定位方式                                                | absolute \| fixed                       | absolute                                                     | 1.7.0 |
| placement            | 弹出窗口的位置                                          | bottom \| top \| left \| right          | bottom                                                       | 1.7.0 |

<br/>

### 事件

| 事件名       | 描述               | 参数                                                         | 版本  |
| ------------ | ------------------ | ------------------------------------------------------------ | ----- |
| change       | 颜色值变化         | function(value: string｜string [],color: string,index: number) |       |
| formatChange | 格式变化           | function(format: string)                                     | 1.7.0 |
| close-picker | 关闭拾取器         | function(value: string｜string [])                           | 1.5.0 |
| overflow-max | 颜色添加达到最大值 | —                                                            |       |

