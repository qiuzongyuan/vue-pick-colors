# 开始

## 使用包管理器
```
# 使用 NPM
npm install vue-pick-colors -S

# 使用 Yarn
yarn add vue-pick-colors
```

### 使用

```vue
<template>
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import pickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```