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

# Usage

## Basic Usage

`value` is set to `#ff4500` <pick-colors v-model:value="value"/>

```vue
<template>
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```


## Alpha

Use `show-alpha` <pick-colors v-model:value="showAlphaValue" show-alpha/>

```vue
<template>
  <pick-colors v-model:value="value" show-alpha/>
</template>

<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('rgba(255, 69, 0, 0.68)')
</script>
```

## Format

`format` is set to `rgb` <pick-colors v-model:value="formatValue" :format="format" show-alpha/>

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

## Format Options

`format-options` is set to `['rgb', 'hex', 'hsl', 'hsv']` <pick-colors v-model:value="formatOptionsValue" :format="format" :format-options="formatOptions" show-alpha/>

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

## Size

Use `size` <pick-colors v-model:value="sizeValue" :size="size"/>

If `width` or `height` is empty, use `size`

`width` is set to `80`  <pick-colors v-model:value="sizeValue" :width="width"/>

`height` is set to `80` <pick-colors v-model:value="sizeValue" :height="height"/>

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

## Predefined Colors

Use `colors` <pick-colors v-model:value="colorsValue" show-alpha :colors="colors"/>

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

## Theme

Use `theme`  <pick-colors v-model:value="themeValue" show-alpha theme="dark" />

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

## Control Picker

<ClientOnly>
Use <code>show-picker</code>
<pick-colors v-model:value="showPickerValue" v-model:show-picker="showPicker"/>
<div class="primary-button"  @click="toggleShowPicker">
  {{ showPicker ? 'close' : 'open' }}
</div>
</ClientOnly>

```vue
<template>
  <pick-colors v-model:value="value" v-model:show-picker="showPicker"/>
  <button class="primary-button" @click="toggleShowPicker">{{ showPicker ? 'close' : 'open' }}</button>
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
    padding: 0 20px;
    border-radius: 5px;
    display: inline;
    font-weight: 500;
    margin:0 10px;
  }
</style>
```


## Add Color

Use `add-color`  <pick-colors v-model:value="addColorValue" add-color />

```vue
<template>
  <pick-colors v-model:value="value" add-color />
</template>
<script lang="ts" setup>
  import PickColors from 'vue-pick-colors'
  const value = ref('#1f93ff')
</script>
```


### API
| Property             | Description                                                  | Type                          | Default                                                      | version |
| -------------------- | ------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------ | ------- |
| value(v-model)       | binding value, support hex、rgb、rgba、hsl、hsla、hsv、hsva  | string ｜ string[]            | —                                                            |         |
| show-picker(v-model) | control picker hide or show                                  | boolean                       | —                                                            | 1.5.0   |
| size                 | color block size                                             | number \| string              | 20                                                           |         |
| width                | color block width, if empty use size                         | number \| string              | —                                                            | 1.5.0   |
| height               | color block height, if empty use size                        | number \| string              | —                                                            | 1.5.0   |
| theme                | component theme                                              | light ｜ dark                 | light                                                        |         |
| colors               | predefined color options support hex、rgb、rgba、hsl、hsla、hsva、hsv | string []                     | <div  style="word-break: break-all;width: 120px;">['#ff4500','#ff8c00','#ffd700', '#90ee90','#00ced1','#1e90ff', '#c71585','#ff4500','#ff7800', '#00babd','#1f93ff','#fa64c3']</div> |         |
| format               | color format                                                 | hex ｜ rgb ｜ hsl \| hsv      | hex                                                          |         |
| show-alpha           | whether to display the alpha slider                          | boolean                       | false                                                        |         |
| add-color            | support for adding colors                                    | boolean                       | false                                                        |         |
| popup-container      | defines the container for the picker                         | string \| Vue.RendererElement | 'body'                                                       | 1.5.0   | 
|z-index | the z-index  of the picker      | number | 1000 | 1.5.0 |
| max     | maximum number of colors to add | number | 13   |       |
| format-options       | Format options, when false, no options appear                | (hex ｜ rgb ｜ hsl ｜ hsv) [] \|false   | ['rgb', 'hex', 'hsl', 'hsv']                                 | 1.7.0   |
| position             | The position  of the picker                                  | absolute \| fixed                        | absolute                                                     | 1.7.0   |
| placement            | The placement of the picker                                  | bottom  \| top \| left \| right             | bottom                                                       | 1.7.0   |

### Events

| Events Name  | Description        | Arguments                                                    | version |
| ------------ | ------------------ | ------------------------------------------------------------ | ------- |
| change       | color value change | function(value: string｜string [],color: string,index: number) |         |
| formatChange | format change      | function(format: string)                                     |    1.7.0     |
| close-picker  | close picker       | function(value: string｜string [])                           | 1.5.0   |
| <div style="white-space: nowrap;">overflow-max</div> | color added to max | —                                                            |         |
