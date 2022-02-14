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

| 属性             | 说明      | 类型                    | 默认值                                                                                                                                       |
|----------------|---------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| value(v-model) | 值       | string                | #ff0000                                                                                                                                   |
| format         | 格式      | 'hex' /  'rgb' / 'hsl'                                                                                                                                  | hex                                                                                                                                       |
| show-alpha     | 展示透明度选择 | boolean               | false                                                                                                                                     |
| theme          | 主题      | 'light' / 'dark'      | light                                                                                                                                     |
| colors         | 预留颜色组   | string []             | ['#ff4500', '#ff8c00', '#ffd700',<br> '#90ee90', '#00ced1', '#1e90ff',<br> '#c71585', '#ff4500', '#ff7800',<br>'#00babd', '#1f93ff', '#fa64c3'] |
<br/>
事件：

| 事件名称 | 说明               | 回调参数               |
| -------- | ------------------ | ---------------------- |
| change   | 颜色变化时回调函数 | Function(color:string) |
