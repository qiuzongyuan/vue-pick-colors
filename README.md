### vue-pick-colors：颜色拾取器

<img src="./images/effect.png"  style="zoom:50%;" />

安装：

```
npm i vue-pick-colors -S
```



API：

| 属性           | 说明               | 类型            | 默认值    |
| -------------- | ------------------ | --------------- | --------- |
| value(v-model) | 值                 | String          | #FF0000FF |
| format         | 格式               | hex / rgb / hsl | hex       |
| show-alpha     | 是否支持透明度选择 | boolean         | true      |

事件：

| 事件名称 | 说明               | 回调参数               |
| -------- | ------------------ | ---------------------- |
| change   | 颜色变化时回调函数 | Function(color:string) |



TODO:

- 颜色校验
- 多颜色拾取
- 预备颜色列表
- 暗黑主题