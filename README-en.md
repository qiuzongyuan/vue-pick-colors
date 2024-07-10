### [vue-pick-colors](https://github.com/qiuzongyuan/vue-pick-colors)

>  🎉 A Color picker for Vue.js 3

> [🇨🇳中文](https://github.com/qiuzongyuan/vue-pick-colors/blob/main/README.md)

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

| Property             | Description                                                  | Type                                    | Default                                                      | version |
| -------------------- | ------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------ | ------- |
| value(v-model)       | Binding value, support hex、rgb、rgba、hsl、hsla、hsv、hsva  | string ｜ string[]                      | —                                                            |         |
| show-picker(v-model) | Control picker hide or show                                  | boolean                                 | —                                                            | 1.5.0   |
| size                 | Color block size                                             | number \| string                        | 20                                                           |         |
| width                | Color block width, if empty use size                         | number \| string                        | —                                                            | 1.5.0   |
| height               | Color block height, if empty use size                        | number \| string                        | —                                                            | 1.5.0   |
| theme                | Component theme                                              | light ｜ dark                           | light                                                        |         |
| colors               | Predefined color options support hex、rgb、rgba、hsl、hsla、hsva、hsv | string []                               | ['#ff4500','#ff8c00','#ffd700', '#90ee90','#00ced1','#1e90ff', '#c71585','#ff4500','#ff7800', '#00babd','#1f93ff','#fa64c3'] |         |
| format               | Color format                                                 | hex ｜ rgb ｜ hsl \| hsv                | hex                                                          |         |
| show-alpha           | Whether to display the alpha slider                          | boolean                                 | false                                                        |         |
| add-color            | Support for adding colors                                    | boolean                                 | false                                                        |         |
| popup-container      | Defines the container for the picker                         | string \| Vue.RendererElement\| boolean | 'body'                                                       | 1.5.0   |
| z-index              | The z-index  of the picker                                   | number                                  | 1000                                                         | 1.5.0   |
| max                  | Maximum number of colors to add                              | number                                  | 13                                                           |         |
| format-options       | Format options, when false, no options appear                | (hex ｜ rgb ｜ hsl ｜ hsv) [] \|false   | ['rgb', 'hex', 'hsl', 'hsv']                                 | 1.7.0   |
| position             | The position  of the picker                                  | absolute \|fixed                        | absolute                                                     | 1.7.0   |
| placement            | The placement of the picker                                  | bottom \|top \|left \|right             | bottom                                                       | 1.7.0   |



<br/>

### Events

| Events Name  | Description        | Arguments                                                    | version |
| ------------ | ------------------ | ------------------------------------------------------------ | ------- |
| change       | color value change | function(value: string｜string [],color: string,index: number) |         |
| formatChange | format change      | function(format: string)                                     |    1.7.0     |
| close-picker | close picker       | function(value: string｜string [])                           | 1.5.0   |
| overflow-max | color added to max | —                                                            |         |