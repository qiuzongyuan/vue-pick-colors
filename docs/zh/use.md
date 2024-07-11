<script setup>
import { ref, unref } from 'vue'
const value = ref('#ff4500')
const showAlphaValue = ref('rgba(255, 69, 0, 0.68)')
const formatValue = ref('#90ee90')
const formatOptionsFalseValue = ref('#ffe243ff')
const formatOptionsValue = ref('#1e90ffff')
const sizeValue = ref('#00ced1')
const colorsValue = ref('#1e90ffff')
const themeValue = ref('#1e3b56ff')
const showPickerValue = ref('#fa64c3')
const addColorValue = ref('#1f93ff')
const colors = ref([
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    '#ff4500',
    '#ffd700',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
  ])
  const format = ref('rgb')
  const size = ref(40)
  const width = ref(80)
  const height = ref(80)
  const theme = ref('dark')
  const showPicker = ref(false)
  const toggleShowPicker = () => {
    showPicker.value = !unref(showPicker)
  }
  const formatOptions = ref(['rgb', 'hex', 'hsl', 'hsv'])
</script>

# 快速上手

## 基本使用

`value` 设置为 `#ff4500` <pick-colors v-model:value="value"/>

```vue
<template>
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```


## 使用透明度

使用 `show-alpha` <pick-colors v-model:value="showAlphaValue" show-alpha/>

```vue
<template>
  <pick-colors v-model:value="value" show-alpha/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('rgba(255, 69, 0, 0.68)')
</script>
```

## 设置格式化

`format` 设置为 `rgb` <pick-colors v-model:value="formatValue" :format="format" show-alpha/>

```vue
<template>
  <pick-colors v-model:value="value" :format="format" show-alpha/>
</template>

<script lang="ts" setup>
  import pickColors, { Format } from 'vue-pick-colors'
  const value = ref('#90ee90')
  const format = ref<Format>('rgb')
</script>
```


## 设置格式选项

`format-options` 设置为 `['rgb', 'hex', 'hsl', 'hsv']` <pick-colors v-model:value="formatOptionsValue" :format="format" :format-options="formatOptions" show-alpha/>

```vue
<template>
  <pick-colors v-model:value="value" :format="format" :format-options="formatOptions" show-alpha/>
</template>

<script lang="ts" setup>
  import pickColors, { Format } from 'vue-pick-colors'
  const value = ref('#1e90ffff')
  const format = ref<Format>('rgb')
  const formatOptions = ref<Format []>(['rgb', 'hex', 'hsl', 'hsv'])
</script>
```

## 设置尺寸

使用 `size` <pick-colors v-model:value="sizeValue" :size="size"/>

如果 `width` 或者 `height` 为空，则使用 `size`

`width` 设置 `80`  <pick-colors v-model:value="sizeValue" :width="width"/>

`height` 设置 `80` <pick-colors v-model:value="sizeValue" :height="height"/>

```vue
<template>
  <pick-colors v-model:value="value"/>
  <pick-colors v-model:value="value" :width="width"/>
  <pick-colors v-model:value="value" :height="height"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#00ced1')
  const size = ref(40)
  const width = ref(80)
  const height = ref(80)
</script>
```

## 设置预定义颜色

使用 `colors` <pick-colors v-model:value="colorsValue" show-alpha :colors="colors"/>

```vue
<template>
  <pick-colors v-model:value="value" show-alpha :colors="colors"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#1e90ffff')
  const colors = ref([
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        '#ff4500',
        '#ffd700',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
    ])
</script>
```

## 使用主题

使用 `theme`  <pick-colors v-model:value="themeValue" show-alpha theme="dark" />

```vue
<template>
  <pick-colors v-model:value="value" show-alpha :theme="theme" />
</template>
<script lang="ts" setup>
  import pickColors, { Theme } from 'vue-pick-colors'
  const theme = ref<Theme>('dark')
  const value = ref('#1e3b56ff')
</script>
```

## 控制拾取器

<ClientOnly>
使用 <code>show-picker</code>
<pick-colors v-model:value="showPickerValue" v-model:show-picker="showPicker"/>
<div class="primary-button" @click="toggleShowPicker">{{ showPicker ? '关闭' : '打开' }}</div>
</ClientOnly>

```vue
<template>
  <pick-colors v-model:value="value" v-model:show-picker="showPicker"/>
  <button class="primary-button" @click="toggleShowPicker">{{ showPicker ? '关闭' : '打开' }}</button>
</template>
<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#fa64c3')
  const showPicker = ref(false)
</script>
<style scoped>
  .primary-button {
    color: #fff;
    border-color: #1890ff;
    background: #1890ff;
    text-shadow: 0 -1px 0 rgba(0,0,0,.12);
    box-shadow: 0 2px #0000000b;
    padding: 3px 20px;
    border-radius: 5px;
    display: inline;
    font-weight: 500;
    margin:0 10px;
  }
</style>
```


## 添加颜色

使用 `add-color`  <pick-colors v-model:value="addColorValue" add-color />

```vue
<template>
  <pick-colors v-model:value="value" add-color />
</template>
<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#1f93ff')
</script>
```

## API

| 属性                 | 说明                                                    | 类型                          |                                                              | 版本  |
| -------------------- | ------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ | ----- |
| value(v-model)       | 值，<br/>支持hex、rgb、rgba、hsl、hsla、hsv、hsva       | string ｜ string[]            | —                                                            |       |
| show-picker(v-model) | 控制拾取器隐藏或显示                                    | boolean                       | —                                                            | 1.5.0 |
| size                 | 颜色块大小                                              | number \| string              | 20                                                           |       |
| width                | 色块宽度<br />如果为空使用 `size`属性                   | number \| string              | —                                                            | 1.5.0 |
| height               | 色块高度<br />如果为空使用 `size`属性                   | number \| string              | —                                                            | 1.5.0 |
| theme                | 主题                                                    | light ｜ dark                 | light                                                        |       |
| colors               | 预留颜色组<br/>支持hex、rgb、rgba、hsl、hsla、hsv、hsva | string []                     | <div  style="word-break: break-all;width: 120px;">['#ff4500','#ff8c00','#ffd700', '#90ee90','#00ced1','#1e90ff', '#c71585','#ff4500','#ff7800', '#00babd','#1f93ff','#fa64c3']</div> |       |
| format               | 颜色值格式化                                            | hex ｜ rgb ｜ hsl ｜ hsv      | hex                                                          |       |
| show-alpha           | 是否支持透明度选择                                      | boolean                       | false                                                        |       |
| add-color            | 是否支持添加颜色                                        | boolean                       | false                                                        |       |
| popup-container      | 定义拾取器的容器                                        | string \| Vue.RendererElement | 'body'                                                       | 1.5.0 |
| z-index | 拾取器的层级   | number | 1000 | 1.5.0 |
| max     | 添加颜色最大数 | number | 13   |       |
| format-options       | 格式选项，当为false时，不出现选项                       | (hex ｜ rgb ｜ hsl ｜ hsv) [] \| false  | ['rgb', 'hex', 'hsl', 'hsv']                                 | 1.7.0 |
| position             | 定位方式                                                | absolute \| fixed                       | absolute                                                     | 1.7.0 |
| placement            | 弹出窗口的位置                                          | bottom \| top \| left \| right          | bottom    | 1.7.0 |

## 事件

| 事件名       | 描述               | 参数                                                         | 版本  |
| ------------ | ------------------ | ------------------------------------------------------------ | ----- |
| change       | 颜色值变化         | function(value: string｜string [],color: string,index: number) |       |
| formatChange | 格式变化           | function(format: string)                                     | 1.7.0 |
| close-picker | 关闭拾取器         | function(value: string｜string [])                           | 1.5.0 |
| <div style="white-space: nowrap;">overflow-max</div> | 颜色添加达到最大值 | —                                                            |       |

