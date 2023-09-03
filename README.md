### [vue-pick-colors](https://github.com/qiuzongyuan/vue-pick-colors)

>  🎉 A Color picker for Vue.js 3

> The appearance style is based on [vue-color-kit](https://github.com/anish2690/vue-color-kit)

> [🇨🇳中文版](https://github.com/qiuzongyuan/vue-pick-colors/blob/main/README-zh_CN.md)


### [Demo](https://qiuzongyuan.github.io/vue-pick-colors/use.html)

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
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```

<br/>

### API
| Property             | Description                                                  | Type                                    | Default                                                      | version |
| -------------------- | ------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------ | ------- |
| value(v-model)       | binding value, support hex、rgb、rgba、hsl、hsla、hsv、hsva  | string ｜ string[]                      | —                                                            |         |
| show-picker(v-model) | control picker hide or show                                  | boolean                                 | —                                                            | 1.5.0   |
| size                 | color block size                                             | number \| string                        | 20                                                           |         |
| width                | color block width, if empty use size                         | number \| string                        | —                                                            | 1.5.0   |
| height               | color block height, if empty use size                        | number \| string                        | —                                                            | 1.5.0   |
| theme                | component theme                                              | light ｜ dark                           | light                                                        |         |
| colors               | predefined color options support hex、rgb、rgba、hsl、hsla、hsva、hsv | string []                               | ['#ff4500','#ff8c00','#ffd700', '#90ee90','#00ced1','#1e90ff', '#c71585','#ff4500','#ff7800', '#00babd','#1f93ff','#fa64c3'] |         |
| format               | color format                                                 | hex ｜ rgb ｜ hsl \| hsv                | hex                                                          |         |
| show-alpha           | whether to display the alpha slider                          | boolean                                 | false                                                        |         |
| add-color            | support for adding colors                                    | boolean                                 | false                                                        |         |
| popup-container      | defines the container for the picker                         | string \| Vue.RendererElement\| boolean | 'body'                                                       | 1.5.0   |
| z-index              | the z-index  of the picker                                   | number                                  | 1000                                                         | 1.5.0   |
| max                  | maximum number of colors to add                              | number                                  | 13                                                           |         |



<br/>

### Events

| Events Name  | Description        | Arguments                                                    | version |
| ------------ | ------------------ | ------------------------------------------------------------ | ------- |
| change       | color value change | function(value: string｜string [],color: string,index: number) |         |
| close-picker  | close picker       | function(value: string｜string [])                           | 1.5.0   |
| overflow-max | color added to max | —                                                            |         |